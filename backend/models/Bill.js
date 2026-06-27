import mongoose from "mongoose";

const billSchema = mongoose.Schema(
  {
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
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      index: true
    },
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admission",
      index: true
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    items: [
      {
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 }
      }
    ],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    tax: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      required: true,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    paymentStatus: {
      type: String,
      default: "unpaid",
      enum: ["unpaid", "partially-paid", "paid"],
      index: true
    },
    paymentMethod: {
      type: String,
      default: "none",
      enum: ["cash", "card", "upi", "insurance", "none"],
      index: true
    },
    paymentDate: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", billSchema);
export default Bill;
