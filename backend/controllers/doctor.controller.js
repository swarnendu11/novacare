import Appointment from "../models/Appointment.js";
import Prescription from "../models/Prescription.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";
import logger from "../utils/logger.js";

// @desc    Get appointments assigned to logged-in doctor
// @route   GET /api/doctor/appointments
// @access  Private (Doctor only)
export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ doctorId: req.user._id }).sort({ date: 1 });
  res.json(appointments);
});

// @desc    Create patient prescription & fire notifications
// @route   POST /api/doctor/prescriptions
// @access  Private (Doctor only)
export const createPrescription = asyncHandler(async (req, res) => {
  const { appointmentId, patientId, diagnosis, symptoms, medicines, testRequests, notes } = req.body;

  const patient = await User.findById(patientId);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  const prescription = await Prescription.create({
    appointmentId,
    patientId,
    patientName: patient.name,
    doctorId: req.user._id,
    doctorName: req.user.name,
    diagnosis,
    symptoms,
    medicines,
    testRequests,
    notes
  });

  // Mark appointment as completed if prescription is written
  if (appointmentId) {
    await Appointment.findByIdAndUpdate(appointmentId, { status: "completed" });
    logger.info(`Appointment ${appointmentId} marked completed by writing prescription.`);
  }

  // Create notifications for patient and pharmacy
  await createNotification({
    recipientId: patientId,
    title: "New E-Prescription Issued",
    message: `Dr. ${req.user.name} has issued a new prescription for: ${diagnosis}.`,
    type: "prescription"
  });

  await createNotification({
    recipientId: null, // Broadcast to Pharmacy role
    title: "Pending Dispensation Order",
    message: `New prescription issued for patient ${patient.name} requires dispensation.`,
    type: "prescription",
    role: "pharmacy"
  });

  res.status(201).json(prescription);
});

// @desc    Get patient medical records
// @route   GET /api/doctor/patients/:id/records
// @access  Private (Doctor/Nurse only)
export const getPatientMedicalRecords = asyncHandler(async (req, res) => {
  const patient = await User.findById(req.params.id).select("-password -refreshToken");
  if (!patient || patient.role !== "patient") {
    res.status(404);
    throw new Error("Patient profile not found");
  }

  const [appointments, prescriptions, admissions] = await Promise.all([
    Appointment.find({ patientId: patient._id }),
    Prescription.find({ patientId: patient._id }),
    Admission.find({ patientId: patient._id })
  ]);

  res.json({
    patient,
    appointments,
    prescriptions,
    admissions
  });
});

// @desc    Add clinical diagnosis note to patient records
// @route   POST /api/doctor/patients/:id/notes
// @access  Private (Doctor only)
export const addDiagnosisNote = asyncHandler(async (req, res) => {
  const { condition, notes } = req.body;

  const patient = await User.findById(req.params.id);
  if (!patient || patient.role !== "patient") {
    res.status(404);
    throw new Error("Patient profile not found");
  }

  patient.medicalHistory.push({
    condition,
    diagnosedDate: new Date(),
    notes
  });

  await patient.save();
  res.json({ message: "Clinical note added successfully", history: patient.medicalHistory });
});
