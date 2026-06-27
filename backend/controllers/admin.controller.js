import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Admission from "../models/Admission.js";
import Medicine from "../models/Medicine.js";
import AmbulanceTrip from "../models/AmbulanceTrip.js";
import Equipment from "../models/Equipment.js";
import Bill from "../models/Bill.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Get system-wide hospital analytics dashboard
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
export const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalPatients,
    totalDoctors,
    totalAppointments,
    activeAdmissions,
    totalMedicines,
    activeTrips,
    totalEquipment,
    billingAgg
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "patient" }),
    User.countDocuments({ role: "doctor" }),
    Appointment.countDocuments(),
    Admission.countDocuments({ status: "admitted" }),
    Medicine.countDocuments(),
    AmbulanceTrip.countDocuments({ status: { $in: ["dispatched", "on-scene", "transporting"] } }),
    Equipment.countDocuments(),
    Bill.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$total" }, paidRevenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$total", 0] } } } }
    ])
  ]);

  const appointmentsByStatus = await Appointment.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const apptStats = {};
  appointmentsByStatus.forEach(status => {
    apptStats[status._id] = status.count;
  });

  const revenue = billingAgg[0] || { totalRevenue: 0, paidRevenue: 0 };

  res.json({
    usersCount: totalUsers,
    patientsCount: totalPatients,
    doctorsCount: totalDoctors,
    appointmentsCount: totalAppointments,
    appointmentsByStatus: apptStats,
    activeAdmissionsCount: activeAdmissions,
    totalMedicinesInStock: totalMedicines,
    activeAmbulanceTrips: activeTrips,
    equipmentCount: totalEquipment,
    financials: {
      totalBilled: revenue.totalRevenue,
      totalCollected: revenue.paidRevenue,
      pendingCollection: revenue.totalRevenue - revenue.paidRevenue
    }
  });
});

// @desc    Manage Hospital Equipment CRUD
// @route   GET /api/admin/equipment
// @access  Private (Admin only)
export const getEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.find({});
  res.json(equipment);
});

export const addEquipment = asyncHandler(async (req, res) => {
  const { name, serialNumber, department, status, purchaseDate, nextMaintenanceDate } = req.body;
  const newEquip = await Equipment.create({
    name,
    serialNumber,
    department,
    status,
    purchaseDate,
    nextMaintenanceDate
  });
  res.status(201).json(newEquip);
});

export const updateEquipment = asyncHandler(async (req, res) => {
  const equip = await Equipment.findById(req.params.id);
  if (!equip) {
    res.status(404);
    throw new Error("Equipment not found");
  }

  equip.name = req.body.name || equip.name;
  equip.status = req.body.status || equip.status;
  equip.lastMaintenanceDate = req.body.lastMaintenanceDate || equip.lastMaintenanceDate;
  equip.nextMaintenanceDate = req.body.nextMaintenanceDate || equip.nextMaintenanceDate;

  const updated = await equip.save();
  res.json(updated);
});
