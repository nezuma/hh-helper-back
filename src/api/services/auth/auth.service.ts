import { Types } from "mongoose";
import { appConfig } from "@main";
import * as jwt from "jsonwebtoken";
import { ApiError } from "@api/errors";
import { IAuthLog, IRegister, ITokens } from "./auth.types";
import { IUser, UserService } from "../user";
import { type JwtPayload } from "jsonwebtoken";
import { AuthLogService } from "./auth-logs.service";
import { User } from "@api/models";
import { CryptoService } from "./crypto.service";
import { TariffService } from "../tariff";
import { MailService } from "../mail";

export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private cryptoService: CryptoService,
    private tariffService: TariffService,
    private authLogService: AuthLogService
  ) {}

  async registerUser({
    email,
    login,
    password,
    confirmPassword,
  }: IRegister): Promise<ITokens> {
    if (password.length <= 5) {
      throw ApiError.badRequest({ msg: "Пароль слишком короткий", alert: true });
    }
    if (password !== confirmPassword) {
      throw ApiError.badRequest({ msg: "Проли не совпадают", alert: true });
    }
    const findedUserByEmail = await User.findOne({ email: email }).lean();
    if (findedUserByEmail) {
      throw ApiError.alreadyExists({
        msg: "Пользователь с такой почтой уже существует",
        alert: true,
      });
    }
    const findedUserByLogin = await User.findOne({ login: login }).lean();
    if (findedUserByLogin) {
      throw ApiError.alreadyExists({
        msg: "Пользователь с таким логином уже существует",
        alert: true,
      });
    }

    try {
      const hashedPassword = this.cryptoService.encodeToSHA256(password);
      const baseTariff = await this.tariffService.getBaseTariff();
      const newUser = await this.userService.createUser({
        email,
        login,
        hashedPassword,
        tariffName: baseTariff.name,
        tariffDuration: baseTariff.duration,
      });
      const regToken = this.cryptoService.encodeToSHA256(String(newUser._id));
      const accessToken = this.cryptoService.generateAccessToken(newUser._id);
      const refreshToken = this.cryptoService.generateRefreshToken(newUser._id);

      const verificationUrl =
        appConfig.SERVICE_MODE === "dev"
          ? `http://${appConfig.CLIENT_URL}:5173/register/accept?token=${regToken}&email=${email}&userId=${newUser._id}`
          : `https://${appConfig.CLIENT_URL}/register/accept?token=${regToken}&email=${email}&userId=${newUser._id}`;
      if (appConfig.SERVICE_MODE === "dev") {
        console.log(verificationUrl);
      }

      await this.authLogService.createAuthLog({
        email,
        userId: newUser._id,
        regToken,
        accessToken,
        refreshToken,
        verificationUrl,
      });

      if (appConfig.SERVICE_MODE !== "dev") {
        const message = this.mailService.createStringForSendAuthLink(verificationUrl);

        await this.mailService.sendHtmlMail({
          mail: email,
          subject: "Подтверждение почты на сервисе hh-helper",
          html: message,
        });
      }

      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      console.log(e);
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
      const newAccessToken = this.cryptoService.generateAccessToken(user._id);
      await this.authLogService.updateAuthLogById({
        id: authLog._id,
        data: { accessToken: newAccessToken },
      });
      return newAccessToken;
    }
  }
}
