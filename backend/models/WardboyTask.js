import mongoose from "mongoose";

const wardboyTaskSchema = mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    assignedToName: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "in-progress", "completed"],
      index: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true,
  }
);

const WardboyTask = mongoose.model("WardboyTask", wardboyTaskSchema);
export default WardboyTask;
