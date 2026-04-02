import mongoose from "mongoose";
import { ITariff } from "@api/services/tariff/tariff.types";

export enum TariffKeys {
  BASE = "base",
  ADVANCED = "advanced",
  PREMIUM = "premium",
}

const tariffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: null,
    },
    key: {
      type: String,
      enum: Object.values(TariffKeys),
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    features: {
      choose_response: {
        type: Boolean,
        default: false,
      },
      main_page: {
        type: Boolean,
        default: false,
      },
      activate_bot: {
        type: Boolean,
        default: false,
      },
      autoresponse: {
        type: Boolean,
        default: false,
      },
      autoboost_vacancy: {
        type: Boolean,
        default: false,
      },
      priority_help: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tariff = mongoose.model<ITariff>("Tariff", tariffSchema);
