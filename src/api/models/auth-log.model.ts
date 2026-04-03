import mongoose from "mongoose";
import { IAuthLog } from "@api/services";

const authLogSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId || null,
    login: String,
    liveAt: Date,
    active: {
      type: Boolean,
      dafault: true,
      required: true,
    },
    accessToken: String || null,
    refreshToken: String || null,
    device: {
      ip: String,
      os: String,
      isBot: Boolean,
      isMobile: Boolean,
      isDesktop: Boolean,
      isTV: Boolean,
      browser: String,
      version: String,
      platform: String,
      token: String || null,
      userId: Number || null,
      lastVisitAt: Date || null,
    },
  },
  {
    timestamps: true,
  }
);
export const AuthLog = mongoose.model<IAuthLog>("AuthLog", authLogSchema);
