import { Types } from "mongoose";

export interface IRegister {
  email: string;
  login: string;
  password: string;
  confirmPassword: string;
}

export interface IAuth {
  authPhone: string;
}

export interface IAuthLog {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  email: string;
  code: number;
  liveAt: Date;
  active: boolean;
  regToken: string;
  accessToken: string;
  refreshToken: string;
  verificationUrl?: string;
}

export interface IAuthAccept {
  userId: string;
  code: number;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
