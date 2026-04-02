import { Types } from "mongoose";
import { AuthLog } from "@api/models";
import { IAuthLog } from "./auth.types";
import { ApiError } from "@api/errors";

export class AuthLogService {
  async createAuthLog({
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
  }): Promise<IAuthLog> {
    const liveAt = new Date(Number(new Date()) + 5 * 60 * 1000);
    const authLog = await AuthLog.create({
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

  async findAuthLogByPhone(authPhone: string): Promise<IAuthLog> {
    const authLog = await AuthLog.findOne({
      authPhone: authPhone,
    }).sort({ createdAt: -1 });
    return authLog;
  }

  async findAuthLogByUserId(userId: Types.ObjectId): Promise<IAuthLog> {
    const authLog = await AuthLog.findOne({
      userId,
    }).sort({ createdAt: -1 });
    return authLog;
  }

  async findAuthLogByRefreshToken(refreshToken: string): Promise<IAuthLog> {
    const authLog = await AuthLog.findOne({
      refreshToken,
    }).sort({ createdAt: -1 });
    return authLog;
  }

  async updateAuthLogById({
    id,
    data,
  }: {
    id: Types.ObjectId;
    data: object;
  }): Promise<void> {
    await AuthLog.updateOne({ _id: id }, { data });
  }

  async updateAuthLogByUserId(userId: Types.ObjectId): Promise<void> {
    await AuthLog.updateOne(
      { userId },
      {
        active: false,
      }
    );
  }

  async checkSmsTime(authPhone: string): Promise<boolean> {
    const authLog = await this.findAuthLogByPhone(authPhone);
    if (
      authLog &&
      authLog.active &&
      Number(authLog.liveAt) - 4 * 60 * 1000 > Number(new Date())
    ) {
      const awaitTime =
        (Number(authLog.liveAt) - 4 * 60 * 1000 - Number(new Date())) / 1000;

      throw ApiError.alreadyExists({
        msg: `Код уже был отправлен Вам на телефон, повторная отправка будет доступна через: ${Math.floor(awaitTime)} секунд`,
        alert: true,
      });
    }

    const authLogCountForOneUser = await AuthLog.find({
      authPhone: authPhone,
      createdAt: { $gte: new Date(Number(new Date()) - 5 * 60 * 1000) },
    })
      .sort({ createdAt: -1 })
      .countDocuments();

    if (authLogCountForOneUser >= 3) {
      throw ApiError.tooManyRequests({
        msg: "Слишком много попыток авторизации",
        alert: true,
      });
    }

    if (authLog) {
      await this.updateAuthLogById({ id: authLog._id, data: { active: false } });
    }
    return true;
  }
}
