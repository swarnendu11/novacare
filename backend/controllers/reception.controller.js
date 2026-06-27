import User from "../models/User.js";
import Room from "../models/Room.js";
import Admission from "../models/Admission.js";
import Appointment from "../models/Appointment.js";
import Bill from "../models/Bill.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";
import logger from "../utils/logger.js";

// @desc    Register a new patient profile
// @route   POST /api/reception/patients
// @access  Private (Receptionist/Admin only)
export const registerPatientByStaff = asyncHandler(async (req, res) => {
  const { name, email, phone, gender, dob, address, bloodGroup, allergies } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Patient already registered with this email address");
  }

  // Create patient with dummy password that they can reset
  const patient = await User.create({
    name,
    email,
    password: `patient_reception_${Math.random().toString(36).slice(-8)}`,
    role: "patient",
    phone: phone || "",
    gender: gender || "Unspecified",
    dob: dob || null,
    address: address || "",
    bloodGroup: bloodGroup || "Unknown",
    allergies: allergies || "None"
  });

  logger.info(`Receptionist registered patient: ${patient.email}`);
  res.status(201).json(patient);
});

// @desc    Admit patient to specific bed (IPD)
// @route   POST /api/reception/admissions
// @access  Private (Receptionist/Admin only)
export const admitPatient = asyncHandler(async (req, res) => {
  const { patientId, roomId, bedNumber, admittingDoctorId, reason } = req.body;

  // Check patient and doctor validity
  const [patient, doctor, room] = await Promise.all([
    User.findById(patientId),
    User.findById(admittingDoctorId),
    Room.findById(roomId)
  ]);

  if (!patient || patient.role !== "patient") {
    res.status(400);
    throw new Error("Invalid patient selection");
  }
  if (!doctor || doctor.role !== "doctor") {
    res.status(400);
    throw new Error("Invalid admitting doctor selection");
  }
  if (!room) {
    res.status(404);
    throw new Error("Selected room not found");
  }

  // Check if bed is available
  const bed = room.beds.find(b => b.bedNumber === bedNumber);
  if (!bed || bed.isOccupied) {
    res.status(400);
    throw new Error("Selected bed is not available or occupied");
  }

  // Create admission record
  const admissionNumber = `IPD-${Date.now().toString().slice(-6)}`;
  const admission = await Admission.create({
    patientId,
    admissionNumber,
    roomId,
    bedNumber,
    admittingDoctorId,
    reason,
    status: "admitted"
  });

  // Mark bed as occupied in Room schema
  bed.isOccupied = true;
  bed.occupiedBy = patientId;
  await room.save();

  // Create auto-generated billing invoice for admission deposit
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  await Bill.create({
    patientId,
    patientName: patient.name,
    admissionId: admission._id,
    invoiceNumber,
    items: [
      { description: "IPD Admission Admission Charges", amount: 1500, quantity: 1 },
      { description: "Room Security Deposit", amount: 3000, quantity: 1 }
    ],
    subtotal: 4500,
    tax: 450,
    total: 4950,
    paymentStatus: "unpaid"
  });

  logger.info(`Patient ${patient.email} admitted to room ${room.roomNumber} bed ${bedNumber}`);

  // Push notifications
  await createNotification({
    recipientId: patientId,
    title: "Inpatient Admission Complete",
    message: `You have been admitted to Room ${room.roomNumber}, Bed ${bedNumber} under Dr. ${doctor.name}.`,
    type: "billing"
  });

  res.status(201).json(admission);
});

// @desc    Get room and bed availability status
// @route   GET /api/reception/rooms
// @access  Private (Receptionist/Admin/Nurse only)
export const getRoomsLayout = asyncHandler(async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
});
