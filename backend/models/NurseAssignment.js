import mongoose from "mongoose";

const nurseAssignmentSchema = mongoose.Schema(
  {
    nurseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    nurseName: {
      type: String,
      required: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true
    },
    roomNumber: {
      type: String,
      required: true
    },
    shift: {
      type: String,
      required: true,
      enum: ["Morning", "Evening", "Night"]
    },
    date: {
      type: Date,
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
  }
);

// Nurse can only be assigned to one room per shift per date
nurseAssignmentSchema.index({ nurseId: 1, shift: 1, date: 1 }, { unique: true });

const NurseAssignment = mongoose.model("NurseAssignment", nurseAssignmentSchema);
export default NurseAssignment;
