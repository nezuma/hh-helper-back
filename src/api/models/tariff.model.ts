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
    },
    duration: {
      type: String || null,
    },
    key: {
      type: TariffKeys,
    },
    price: {
      type: Number,
    },
    popular: {
      type: Boolean,
    },
    features: {
      choose_response: {
        type: Boolean,
      },
      main_page: {
        type: Boolean,
      },
      activate_bot: {
        type: Boolean,
      },
      autoresponse: {
        type: Boolean,
      },
      autoboost_vacancy: {
        type: Boolean,
      },
      priority_help: {
        type: Boolean,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tariff = mongoose.model<ITariff>("Tariff", tariffSchema);
