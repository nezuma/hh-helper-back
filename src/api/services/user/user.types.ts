import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  login: string;
  password: string;
  name: string;
  tariff: {
    tariffName: string;
    tariffDuration: Date;
  };
  accepted: boolean;
  lastVisitAt: Date;
  accessToken?: string;
  refreshToken?: string;
}

export interface IUserDevice {
  ip: string;
  os: string;
  isBot: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isTV: boolean;
  browser: string;
  version: string;
  platform: string;
  token?: string;
  userId?: number;
  lastVisitAt?: Date;
}
