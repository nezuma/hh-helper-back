import mongoose, { Types } from "mongoose";
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
      tariffId: {
        type: Types.ObjectId,
      },
      tariffName: {
        type: String,
      },
      tariffDuration: {
        type: Date,
      },
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    lastVisitAt: {
      type: Date,
    },
    role: {
      type: String,
      default: "applicant",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
