import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: ["General Ward", "Semi-Private", "Private", "ICU", "OT"],
      index: true
    },
    chargePerDay: {
      type: Number,
      required: true,
      min: 0
    },
    beds: [
      {
        bedNumber: { type: String, required: true },
        isOccupied: { type: Boolean, default: false },
        occupiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
      }
    ],
    department: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
