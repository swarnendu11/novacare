import mongoose from "mongoose";

const prescriptionSchema = mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      index: true
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Patient is required"],
      index: true
    },
    patientName: {
      type: String,
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Doctor is required"],
      index: true
    },
    doctorName: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
      trim: true
    },
    symptoms: {
      type: String,
      default: ""
    },
    medicines: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine"
        },
        name: { type: String, required: true },
        dosage: { type: String, required: true },       // e.g. "1-0-1"
        frequency: { type: String, required: true },    // e.g. "After meals"
        duration: { type: String, required: true },     // e.g. "5 days"
        quantity: { type: Number, required: true, min: 1 }
      }
    ],
    testRequests: [
      { type: String }
    ],
    notes: {
      type: String,
      default: ""
    },
    dispensationStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "partially-dispensed", "dispensed"],
      index: true
    }
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);
export default Prescription;
