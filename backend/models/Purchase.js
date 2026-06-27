import mongoose from "mongoose";

const purchaseSchema = mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    vendorName: {
      type: String,
      required: true,
      index: true
    },
    items: [
      {
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      default: "ordered",
      enum: ["ordered", "shipped", "delivered", "cancelled"],
      index: true
    },
    orderDate: {
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

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
