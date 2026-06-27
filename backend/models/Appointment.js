import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient reference is required"],
      index: true
    },
    patientName: { 
      type: String, 
      required: true 
    },
    doctorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: [true, "Doctor reference is required"],
      index: true
    },
    doctorName: { 
      type: String, 
      required: true 
    },
    department: { 
      type: String, 
      required: [true, "Department is required"] 
    },
    date: { 
      type: Date, 
      required: [true, "Date is required"],
      index: true
    },
    time: { 
      type: String, 
      required: [true, "Time slot is required"] 
    },
    status: {
      type: String,
      default: "scheduled",
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      index: true
    },
    notes: { 
      type: String, 
      default: "" 
    },
    reason: { 
      type: String, 
      default: "" 
    }
  },
  {
    timestamps: true,
  }
);

// Compound index for doctor availability checks
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true, sparse: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
