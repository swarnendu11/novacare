import Ambulance from "../models/Ambulance.js";
import AmbulanceTrip from "../models/AmbulanceTrip.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";
import logger from "../utils/logger.js";

// @desc    Get ambulance vehicle profiles
// @route   GET /api/ambulance/vehicles
// @access  Private
export const getAmbulances = asyncHandler(async (req, res) => {
  const ambulances = await Ambulance.find({});
  res.json(ambulances);
});

// @desc    Disptach/register new emergency ambulance trip
// @route   POST /api/ambulance/trips
// @access  Private (Receptionist/Admin only)
export const dispatchAmbulance = asyncHandler(async (req, res) => {
  const { ambulanceId, patientId, pickupLocation, destination, notes } = req.body;

  const [ambulance, patient] = await Promise.all([
    Ambulance.findById(ambulanceId),
    patientId ? User.findById(patientId) : Promise.resolve(null)
  ]);

  if (!ambulance || ambulance.status !== "available") {
    res.status(400);
    throw new Error("Ambulance vehicle is not available or registered");
  }

  // Create emergency trip
  const trip = await AmbulanceTrip.create({
    ambulanceId,
    patientId,
    patientName: patient ? patient.name : "Anonymous Emergency Case",
    pickupLocation,
    destination,
    notes,
    status: "dispatched"
  });

  // Mark vehicle as dispatched
  ambulance.status = "dispatched";
  await ambulance.save();

  logger.info(`Ambulance vehicle ${ambulance.vehicleNumber} dispatched for trip ${trip._id}`);

  // Create notification for ambulance staff driver
  if (ambulance.driverId) {
    await createNotification({
      recipientId: ambulance.driverId,
      title: "Emergency Dispatch Assigned",
      message: `Emergency dispatch assigned: Pickup at ${pickupLocation} and transport to ${destination}.`,
      type: "emergency"
    });
  }

  res.status(201).json(trip);
});

// @desc    Update live trip status & trigger driver coordinate shifts
// @route   PUT /api/ambulance/trips/:id/status
// @access  Private (Ambulance staff only)
export const updateTripStatus = asyncHandler(async (req, res) => {
  const { status, latitude, longitude } = req.body;
  const trip = await AmbulanceTrip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Emergency trip log not found");
  }

  trip.status = status;
  if (status === "completed") {
    trip.endTime = new Date();
  }
  await trip.save();

  // If coordinates provided, update current Ambulance vehicle GPS
  const ambulance = await Ambulance.findById(trip.ambulanceId);
  if (ambulance) {
    if (status === "completed") {
      ambulance.status = "available";
    }
    if (latitude && longitude) {
      ambulance.currentLocation = {
        latitude,
        longitude,
        updatedAt: new Date()
      };
    }
    await ambulance.save();
  }

  logger.info(`Ambulance trip status updated: ${status} (Trip ID: ${trip._id})`);

  // Broad alert to receptionists on transit state
  if (status === "transporting") {
    await createNotification({
      recipientId: null,
      title: "Ambulance Transport Active",
      message: `Ambulance vehicle ${ambulance ? ambulance.vehicleNumber : ""} is currently in transit with emergency patient.`,
      type: "emergency",
      role: "receptionist"
    });
  }

  res.json(trip);
});
