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
  authPhone: string;
  code: number;
  liveAt: Date;
  active: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthAccept {
  userId: string;
  code: number;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
