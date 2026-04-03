import { Types } from "mongoose";
import { UserService } from "../user";
import { ApiError } from "@api/errors";
import { RegisterLog } from "@api/models";
import { IAcceptRegister, IRegisterLog } from "./auth.types";

export class RegisterLogService {
  constructor(private userService: UserService) {}
  async createRegisterLog({
    email,
    userId,
    regToken,
    accessToken,
    refreshToken,
    verificationUrl,
  }: {
    email: string;
    userId: Types.ObjectId;
    regToken: string;
    accessToken: string;
    refreshToken: string;
    verificationUrl?: string;
  }): Promise<IRegisterLog> {
    const liveAt = new Date(Number(new Date()) + 1 * 60 * 60 * 1000);
    const authLog = await RegisterLog.create({
      userId: userId,
      email: email,
      liveAt: liveAt,
      active: true,
      regToken: regToken,
      accessToken: accessToken,
      refreshToken: refreshToken,
      verificationUrl: verificationUrl,
    });
    return authLog;
  }

  async findRegisterLogByEmail(email: string): Promise<IRegisterLog> {
    const authLog = await RegisterLog.findOne({
      email: email,
    }).sort({ createdAt: -1 });
    return authLog;
  }

  async findRegisterLogByUserId(userId: Types.ObjectId): Promise<IRegisterLog> {
    const registerLog = await RegisterLog.findOne({
      userId,
    }).sort({ createdAt: -1 });
    return registerLog;
  }

  /**
   *
   * @param token
   * @param email
   * @param userId
   * @returns {IRegisterLog}
   */
  async updateRegisterLogForAccept({
    token,
    email,
    userId,
  }: IAcceptRegister): Promise<IRegisterLog> {
    // Ищем лог регистрации и выкидываем если нет лога
    const regLog = await RegisterLog.findOne({
      userId: userId,
      regToken: token,
      email: email,
      active: true,
    });
    if (!regLog) {
      throw ApiError.notFound({ msg: "Неактивная ссылка подтверждения", alert: true });
    }

    // Активируем пользователя и деактивируем активность лога
    await regLog.updateOne({ active: false });
    await this.userService.switchActivateUser(userId, true);
    return regLog;
  }

  // async findAuthLogByRefreshToken(refreshToken: string): Promise<IAuthLog> {
  //   const authLog = await AuthLog.findOne({
  //     refreshToken,
  //   }).sort({ createdAt: -1 });
  //   return authLog;
  // }

  // async updateAuthLogById({
  //   id,
  //   data,
  // }: {
  //   id: Types.ObjectId;
  //   data: object;
  // }): Promise<void> {
  //   await AuthLog.updateOne({ _id: id }, { data });
  // }

  // async updateAuthLogByUserId(userId: Types.ObjectId): Promise<void> {
  //   await AuthLog.updateOne(
  //     { userId },
  //     {
  //       active: false,
  //     }
  //   );
  // }

  // async checkSmsTime(authPhone: string): Promise<boolean> {
  //   const authLog = await this.findAuthLogByPhone(authPhone);
  //   if (
  //     authLog &&
  //     authLog.active &&
  //     Number(authLog.liveAt) - 4 * 60 * 1000 > Number(new Date())
  //   ) {
  //     const awaitTime =
  //       (Number(authLog.liveAt) - 4 * 60 * 1000 - Number(new Date())) / 1000;

  //     throw ApiError.alreadyExists({
  //       msg: `Код уже был отправлен Вам на телефон, повторная отправка будет доступна через: ${Math.floor(awaitTime)} секунд`,
  //       alert: true,
  //     });
  //   }

  //   const authLogCountForOneUser = await AuthLog.find({
  //     authPhone: authPhone,
  //     createdAt: { $gte: new Date(Number(new Date()) - 5 * 60 * 1000) },
  //   })
  //     .sort({ createdAt: -1 })
  //     .countDocuments();

  //   if (authLogCountForOneUser >= 3) {
  //     throw ApiError.tooManyRequests({
  //       msg: "Слишком много попыток авторизации",
  //       alert: true,
  //     });
  //   }

  //   if (authLog) {
  //     await this.updateAuthLogById({ id: authLog._id, data: { active: false } });
  //   }
  //   return true;
  // }
}
