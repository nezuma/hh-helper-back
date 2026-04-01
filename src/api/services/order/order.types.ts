import { Types } from "mongoose";

export interface IOrder {
  _id: Types.ObjectId;
  status: string;
  price: number;
  adres: string;
}
