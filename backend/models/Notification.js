import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ["appointment", "prescription", "billing", "lab", "emergency", "general"],
      index: true
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    role: {
      type: String,
      enum: [
        "patient",
        "doctor",
        "admin",
        "receptionist",
        "nurse",
        "wardboy",
        "pharmacy",
        "lab_technician",
        "ambulance_staff"
      ]
    }
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
