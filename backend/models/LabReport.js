import mongoose from "mongoose";

const labReportSchema = mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    patientName: {
      type: String,
      required: true
    },
    testName: {
      type: String,
      required: true,
      index: true
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    technicianName: {
      type: String
    },
    requestingDoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    requestingDoctorName: {
      type: String
    },
    sampleCollectionDate: {
      type: Date
    },
    reportDate: {
      type: Date,
      index: true
    },
    status: {
      type: String,
      default: "requested",
      enum: ["requested", "sample-collected", "processing", "completed"],
      index: true
    },
    results: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    interpretation: {
      type: String,
      default: ""
    },
    attachments: [
      { type: String } // URLs to Cloudinary or uploaded file paths
    ]
  },
  {
    timestamps: true,
  }
);

const LabReport = mongoose.model("LabReport", labReportSchema);
export default LabReport;
