import { Types } from "mongoose";
import { appConfig } from "@main";
import * as jwt from "jsonwebtoken";
import { ApiError } from "@api/errors";
import { IAuthLog, IRegister } from "./auth.types";
import { IUser, UserService } from "../user";
import { type JwtPayload } from "jsonwebtoken";
import { AuthLogService } from "./auth-logs.service";
import { User } from "@api/models";
import { CryptoService } from "./crypto.service";
import { TariffService } from "../tariff";

export class AuthService {
  constructor(
    private userService: UserService,
    private authLogService: AuthLogService,
    private cryptoService: CryptoService,
    private tariffService: TariffService
  ) {}

  async registerUser({
    email,
    login,
    password,
    confirmPassword,
  }: IRegister): Promise<void> {
    const user = await User.findOne({ $or: [{ email: email, login: login }] }).lean();
    if (!user) {
      if (password === confirmPassword) {
        const hashedPassword = this.cryptoService.encodeToSHA256(password);
        const baseTariff = await this.tariffService.getBaseTariff();
        await User.create({
          email: email,
          login: login,
          password: hashedPassword,
          name: null,
          tariff: {
            tariffName: baseTariff.name,
            tariffDuration: baseTariff.duration,
          },
        });
      }
    }
  }

  async verifyTheProfileExistence(authPhone: string): Promise<IUser | void> {
    if (!authPhone) {
      throw ApiError.badRequest({ msg: "Не введен номер телефона", alert: true });
    }
    const user = await this.userService.getUser(null, authPhone);
    if (!user) {
      return;
    }
  }

  async registratingUserProcess(userId: Types.ObjectId, code: number): Promise<IAuthLog> {
    const authLog = await this.authLogService.findAuthLogByUserId(userId);
    if (!authLog || !authLog.active) {
      throw ApiError.notFound({
        msg: `Время действия кода истекло или код не найден`,
        alert: true,
      });
    }

    if (authLog.code != code) {
      throw ApiError.noPermission({ msg: `Код введен неверно`, alert: true });
    }

    await this.userService.updateUserByUserId(userId);
    await this.authLogService.updateAuthLogByUserId(userId);
    return authLog;
  }

  isValidRussianPhoneNumber(phoneNumber: string): void {
    // Проверяем, что строка состоит из 11 цифр и начинается с 7
    const phoneRegex = /^7\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw ApiError.badRequest({ msg: "Номер телефона введен неверно", alert: true });
    }
  }

  generateAuthCode(): number {
    const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return code;
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

  verifyAccessToken(token: string): string | JwtPayload {
    try {
      const status = jwt.verify(token, appConfig.SESSION_SECRET);
      return status;
    } catch (e) {
      return null;
    }
  }

  verifyRefreshToken(token: string): string | JwtPayload {
    try {
      const status = jwt.verify(token, appConfig.SESSION_SECRET);
      return status;
    } catch (e) {
      return null;
    }
  }

  async verifyAutorizationToken(
    accessToken: string,
    refreshToken: string
  ): Promise<string | void> {
    if (!accessToken && !refreshToken) {
      throw ApiError.unAuth({ msg: "Не авторизован", alert: false });
    }
    const verifyAccess = accessToken ? this.verifyAccessToken(accessToken) : null;
    if (!verifyAccess) {
      const verifyRefresh = this.verifyRefreshToken(refreshToken);
      if (!verifyRefresh) {
        throw ApiError.unAuth({ msg: "Не авторизован", alert: false });
      }
      const authLog: IAuthLog =
        await this.authLogService.findAuthLogByRefreshToken(refreshToken);
      const user = await this.userService.getUser(authLog.userId, null);
      const newAccessToken = this.generateAccessToken(user._id);
      await this.authLogService.updateAuthLogById({
        id: authLog._id,
        data: { accessToken: newAccessToken },
      });
      return newAccessToken;
    }
  }
}
