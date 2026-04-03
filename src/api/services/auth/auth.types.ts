import { Types } from "mongoose";
import { IUserDevice } from "../user";

export interface IRegister {
  email: string;
  login: string;
  password: string;
  confirmPassword: string;
}

export interface IAcceptRegister {
  token: string;
  email: string;
  userId: Types.ObjectId;
}

export interface IAuth {
  login: string;
  password: string;
}

export interface IRegisterLog {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  email: string;
  liveAt: Date;
  active: boolean;
  regToken: string;
  accessToken: string;
  refreshToken: string;
  verificationUrl?: string;
}

export interface IAuthLog {
  _id?: Types.ObjectId;
  userId: Types.ObjectId | null;
  login: string;
  liveAt?: Date;
  active?: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  device: IUserDevice;
}

export interface IAuthAccept {
  userId: string;
  code: number;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthHHBody {
  username: string;
  password: string;
}
