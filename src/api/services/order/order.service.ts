import { Types } from "mongoose";
import { Order } from "@api/models";
import { IOrder } from "./order.types";

export class OrderService {
  constructor() {}

  async getAllOrdersByUserId(userId: Types.ObjectId): Promise<IOrder[]> {
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
    console.log(orders);
    return orders;
  }

  async getOrderById(orderId: Types.ObjectId): Promise<IOrder> {
    const order = await Order.findById(orderId);
    return order;
  }
}
