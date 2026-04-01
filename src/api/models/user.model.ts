import mongoose from "mongoose";
import { IUser } from "@api/services";
import { TariffKeys } from "./tariff.model";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      index: true,
    },
    login: {
      type: String,
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    tariff: {
      tariffName: {
        type: TariffKeys,
      },
      tariffDuration: Date,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
