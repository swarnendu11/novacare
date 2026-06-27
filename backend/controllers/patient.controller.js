import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import LabReport from "../models/LabReport.js";
import Bill from "../models/Bill.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";
import logger from "../utils/logger.js";

// @desc    Get patient appointments
// @route   GET /api/patient/appointments
// @access  Private (Patient only)
export const getPatientAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.user._id }).sort({ date: -1 });
  res.json(appointments);
});

// @desc    Book a new clinic appointment
// @route   POST /api/patient/appointments
// @access  Private (Patient only)
export const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, doctorName, department, date, time, reason } = req.body;

  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== "doctor") {
    res.status(400);
    throw new Error("Invalid doctor selection");
  }

  const appt = await Appointment.create({
    patientId: req.user._id,
    patientName: req.user.name,
    doctorId,
    doctorName: doctor.name,
    department,
    date,
    time,
    reason,
    status: "scheduled"
  });

  logger.info(`Patient ${req.user.email} booked appointment ${appt._id} with Dr. ${doctor.name}`);

  // Notify doctor
  await createNotification({
    recipientId: doctorId,
    title: "New Appointment Booked",
    message: `Patient ${req.user.name} has booked a session for ${date} at ${time}.`,
    type: "appointment"
  });

  res.status(201).json(appt);
});

// @desc    Cancel clinic appointment
// @route   PUT /api/patient/appointments/:id/cancel
// @access  Private (Patient only)
export const cancelAppointment = asyncHandler(async (req, res) => {
  const appt = await Appointment.findById(req.params.id);

  if (appt && appt.patientId.toString() === req.user._id.toString()) {
    appt.status = "cancelled";
    await appt.save();

    logger.info(`Patient ${req.user.email} cancelled appointment ${appt._id}`);

    // Notify doctor
    await createNotification({
      recipientId: appt.doctorId,
      title: "Appointment Cancelled",
      message: `Patient ${req.user.name} has cancelled their appointment scheduled for ${appt.date}.`,
      type: "appointment"
    });

    res.json(appt);
  } else {
    res.status(404);
    throw new Error("Appointment not found or unauthorized access");
  }
});

// @desc    View prescriptions issued to patient
// @route   GET /api/patient/prescriptions
// @access  Private (Patient only)
export const getPatientPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find({ patientId: req.user._id }).sort({ date: -1 });
  res.json(prescriptions);
});

// @desc    View diagnostic lab results
// @route   GET /api/patient/lab-reports
// @access  Private (Patient only)
export const getPatientLabReports = asyncHandler(async (req, res) => {
  const reports = await LabReport.find({ patientId: req.user._id }).sort({ reportDate: -1 });
  res.json(reports);
});

// @desc    View bills and invoicing
// @route   GET /api/patient/bills
// @access  Private (Patient only)
export const getPatientBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find({ patientId: req.user._id }).sort({ date: -1 });
  res.json(bills);
});

// @desc    Simulate and complete bill payment
// @route   POST /api/patient/bills/:id/pay
// @access  Private (Patient only)
export const payBill = asyncHandler(async (req, res) => {
  const { paymentMethod } = req.body;
  const bill = await Bill.findById(req.params.id);

  if (bill && bill.patientId.toString() === req.user._id.toString()) {
    bill.paymentStatus = "paid";
    bill.paymentMethod = paymentMethod || "card";
    bill.paymentDate = new Date();
    
    await bill.save();
    logger.info(`Patient ${req.user.email} completed payment of bill ${bill.invoiceNumber}`);

    // Notify billing / admin roles
    await createNotification({
      recipientId: null,
      title: "Invoice Paid",
      message: `Patient ${req.user.name} completed invoice payment for amount $${bill.total}.`,
      type: "billing",
      role: "admin"
    });

    res.json(bill);
  } else {
    res.status(404);
    throw new Error("Invoice not found or unauthorized access");
  }
});
export default {
  getPatientAppointments,
  bookAppointment,
  cancelAppointment,
  getPatientPrescriptions,
  getPatientLabReports,
  getPatientBills,
  payBill
}
