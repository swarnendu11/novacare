import Admission from "../models/Admission.js";
import NurseAssignment from "../models/NurseAssignment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";
import logger from "../utils/logger.js";

// @desc    Get active inpatient admissions
// @route   GET /api/nurse/admissions
// @access  Private (Nurse/Doctor only)
export const getActiveAdmissions = asyncHandler(async (req, res) => {
  const admissions = await Admission.find({ status: "admitted" }).populate("patientId", "name email phone");
  res.json(admissions);
});

// @desc    Log biometrics / vitals for admitted patient
// @route   POST /api/nurse/admissions/:id/vitals
// @access  Private (Nurse/Doctor only)
export const logPatientVitals = asyncHandler(async (req, res) => {
  const { bp, pulse, temperature, spo2 } = req.body;
  const admission = await Admission.findById(req.params.id);

  if (!admission || admission.status !== "admitted") {
    res.status(404);
    throw new Error("Active inpatient admission profile not found");
  }

  // Push new vitals record
  admission.vitalsLog.push({
    timestamp: new Date(),
    bp,
    pulse,
    temperature,
    spo2,
    recordedBy: req.user._id
  });

  await admission.save();
  logger.info(`Nurse ${req.user.email} logged vitals for admission ${admission._id}`);

  // Create notifications for admitting doctor and patient
  await createNotification({
    recipientId: admission.admittingDoctorId,
    title: "Patient Vitals Recorded",
    message: `Vitals logged for admitted patient (ID: ${admission.patientId}) - Temp: ${temperature}°F, Pulse: ${pulse}bpm, BP: ${bp}.`,
    type: "lab"
  });

  res.json({ message: "Patient vitals logged successfully", vitals: admission.vitalsLog });
});

// @desc    Get shift allocations for nurse
// @route   GET /api/nurse/assignments
// @access  Private (Nurse only)
export const getNurseAssignments = asyncHandler(async (req, res) => {
  const assignments = await NurseAssignment.find({ nurseId: req.user._id }).sort({ date: 1 });
  res.json(assignments);
});
