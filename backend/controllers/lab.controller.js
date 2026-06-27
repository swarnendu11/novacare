import LabReport from "../models/LabReport.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";
import logger from "../utils/logger.js";

// @desc    Get all diagnostic lab report orders
// @route   GET /api/lab/reports
// @access  Private (Lab/Doctor/Admin/Nurse only)
export const getLabReports = asyncHandler(async (req, res) => {
  const { status, patientId } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (patientId) filter.patientId = patientId;

  const reports = await LabReport.find(filter).sort({ createdAt: -1 });
  res.json(reports);
});

// @desc    Register a new lab request order
// @route   POST /api/lab/reports
// @access  Private (Doctor/Receptionist only)
export const requestLabTest = asyncHandler(async (req, res) => {
  const { patientId, testName, requestingDoctorId } = req.body;

  const patient = await User.findById(patientId);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  let doctorName = "";
  if (requestingDoctorId) {
    const doc = await User.findById(requestingDoctorId);
    doctorName = doc ? doc.name : "";
  }

  const report = await LabReport.create({
    patientId,
    patientName: patient.name,
    testName,
    requestingDoctorId,
    requestingDoctorName: doctorName,
    status: "requested"
  });

  logger.info(`Diagnostic Lab Request order raised: ${testName} (ID: ${report._id})`);
  res.status(201).json(report);
});

// @desc    Upload diagnostic values / result & complete test
// @route   PUT /api/lab/reports/:id/results
// @access  Private (Lab Technician only)
export const completeLabReport = asyncHandler(async (req, res) => {
  const { results, interpretation, attachments } = req.body;
  const report = await LabReport.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error("Diagnostic report order not found");
  }

  report.status = "completed";
  report.results = results || {};
  report.interpretation = interpretation || "";
  report.attachments = attachments || [];
  report.technicianId = req.user._id;
  report.technicianName = req.user.name;
  report.reportDate = new Date();

  const completed = await report.save();
  logger.info(`Diagnostic Lab test completed: ${report.testName} (ID: ${report._id})`);

  // Notify patient
  await createNotification({
    recipientId: report.patientId,
    title: "Diagnostic Results Ready",
    message: `Your medical laboratory report for '${report.testName}' is completed and verified.`,
    type: "lab"
  });

  // Notify doctor
  if (report.requestingDoctorId) {
    await createNotification({
      recipientId: report.requestingDoctorId,
      title: "Patient Lab Report Completed",
      message: `Diagnostic test report completed for patient ${report.patientName} (${report.testName}).`,
      type: "lab"
    });
  }

  res.json(completed);
});
