import CryptoJS from "crypto-js";
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
}
