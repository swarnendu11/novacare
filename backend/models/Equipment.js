import mongoose from "mongoose";

const equipmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    department: {
      type: String,
      required: true,
      index: true
    },
    status: {
      type: String,
      default: "operational",
      enum: ["operational", "in-use", "under-repair", "decommissioned"],
      index: true
    },
    purchaseDate: {
      type: Date
    },
    lastMaintenanceDate: {
      type: Date
    },
    nextMaintenanceDate: {
      type: Date,
      index: true
    }
  },
  {
    timestamps: true,
  }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);
export default Equipment;
