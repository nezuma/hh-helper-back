import { Types } from "mongoose";
import { IAuthLog } from "./auth.types";
import { AuthLog } from "@api/models/auth-log.model";
import { ApiError } from "@api/errors";

export class AuthLogService {
  async createAuthLog({
    userId,
    login,
    accessToken,
    refreshToken,
    device,
  }: IAuthLog): Promise<IAuthLog> {
    const newLog = await AuthLog.create({
      userId: userId,
      login: login,
      accessToken: accessToken,
      refreshToken: refreshToken,
      liveAt: new Date(Number(new Date()) + 5 * 60 * 1000),
      device: device,
      active: true,
    });
    return newLog;
  }

  async updateAuthLogByUserId(userId: Types.ObjectId): Promise<void> {
    await AuthLog.updateOne(
      { userId },
      {
        active: false,
      }
    );
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

  async findAuthLogByLogin(login: string): Promise<IAuthLog> {
    const authLog = await AuthLog.findOne({ login: login }).lean();
    return authLog;
  }

  async checkAuthTime(login: string): Promise<boolean> {
    const authLog = await this.findAuthLogByLogin(login);

    const authLogCountForOneUser = await AuthLog.find({
      login: login,
      createdAt: { $gte: new Date(Number(new Date()) - 5 * 60 * 1000) },
    })
      .sort({ createdAt: -1 })
      .countDocuments();

    if (authLogCountForOneUser >= 5) {
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
