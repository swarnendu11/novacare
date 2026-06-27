import mongoose from "mongoose";

const ambulanceSchema = mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    model: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ["ALS", "BLS", "Patient Transit"]
    },
    status: {
      type: String,
      default: "available",
      enum: ["available", "dispatched", "maintenance"],
      index: true
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
      sparse: true
    },
    driverName: {
      type: String
    },
    currentLocation: {
      latitude: { type: Number, default: 0.0 },
      longitude: { type: Number, default: 0.0 },
      updatedAt: { type: Date, default: Date.now }
    }
  },
  {
    timestamps: true,
  }
);

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
export default Ambulance;
