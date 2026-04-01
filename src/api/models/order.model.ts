import { IOrder } from "@api/services/order";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    status: String,
    price: Number,
    adres: String,
  },
  {
    timestamps: true,
  }
);
export const Order = mongoose.model<IOrder>("Order", orderSchema);
