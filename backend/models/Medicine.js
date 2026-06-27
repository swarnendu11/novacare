import mongoose from "mongoose";

const medicineSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true
    },
    genericName: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    manufacturer: {
      type: String,
      default: ""
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true
    },
    reorderLevel: {
      type: Number,
      default: 50
    }
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;
