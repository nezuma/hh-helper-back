import CryptoJS from "crypto-js";
import { Types } from "mongoose";
import { appConfig } from "@main";
import * as jwt from "jsonwebtoken";

export class CryptoService {
  decodeJwtSignature<DecodedData>(authToken: string): DecodedData {
    return jwt.verify(authToken, appConfig.SESSION_SECRET, {
      algorithms: ["HS256"],
    }) as DecodedData;
  }

  encodeToSHA256(string: string): string {
    return String(CryptoJS.SHA256(string));
  }

  generateAccessToken(userId: Types.ObjectId): string {
    return jwt.sign({ id: userId }, appConfig.SESSION_SECRET, {
      expiresIn: 900000,
    });
  }

  generateRefreshToken(userId: Types.ObjectId): string {
    return jwt.sign({ id: userId }, appConfig.SESSION_SECRET, {
      expiresIn: 604800000,
    });
  }
}
