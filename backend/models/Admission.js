import mongoose from "mongoose";

const admissionSchema = mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient reference is required"],
      index: true
    },
    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    admissionDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    dischargeDate: {
      type: Date
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true
    },
    bedNumber: {
      type: String,
      required: true
    },
    admittingDoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    reason: {
      type: String,
      required: true
    },
    vitalsLog: [
      {
        timestamp: { type: Date, default: Date.now },
        bp: String,
        pulse: Number,
        temperature: Number,
        spo2: Number,
        recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ],
    status: {
      type: String,
      default: "admitted",
      enum: ["admitted", "discharged", "transferred"],
      index: true
    }
  },
  {
    timestamps: true,
  }
);

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
