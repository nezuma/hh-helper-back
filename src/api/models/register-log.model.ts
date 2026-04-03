import mongoose from "mongoose";
import { IRegisterLog } from "@api/services";

const registerLogSchema = new mongoose.Schema(
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
export const RegisterLog = mongoose.model<IRegisterLog>("RegisterLog", registerLogSchema);
