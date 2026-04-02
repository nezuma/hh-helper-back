import { IAuthLog } from "@api/services";
import mongoose from "mongoose";

const authLogSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    email: String,
    liveAt: Date,
    active: {
      type: Boolean,
      dafault: true,
      required: true,
    },
    regToken: String,
    accessToken: String,
    refreshToken: String,
    verificationUrl: String,
  },
  {
    timestamps: true,
  }
);
export const AuthLog = mongoose.model<IAuthLog>("AuthLog", authLogSchema);
