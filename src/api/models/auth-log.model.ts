import { IAuthLog } from "@api/services";
import mongoose from "mongoose";

const authLogSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    authPhone: String,
    code: Number,
    liveAt: Date,
    active: {
      type: Boolean,
      dafault: true,
      required: true,
    },
    accessToken: String,
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);
export const AuthLog = mongoose.model<IAuthLog>("AuthLog", authLogSchema);
