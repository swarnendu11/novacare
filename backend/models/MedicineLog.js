import mongoose from "mongoose";

const medicineLogSchema = mongoose.Schema(
  {
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: ["dispensed", "stocked", "expired", "returned"],
      index: true
    },
    quantity: {
      type: Number,
      required: true
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
  }
);

const MedicineLog = mongoose.model("MedicineLog", medicineLogSchema);
export default MedicineLog;
