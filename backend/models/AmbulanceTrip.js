import mongoose from "mongoose";

const ambulanceTripSchema = mongoose.Schema(
  {
    ambulanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ambulance",
      required: true,
      index: true
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    patientName: {
      type: String
    },
    pickupLocation: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "dispatched",
      enum: ["dispatched", "on-scene", "transporting", "completed", "cancelled"],
      index: true
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date
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

const AmbulanceTrip = mongoose.model("AmbulanceTrip", ambulanceTripSchema);
export default AmbulanceTrip;
