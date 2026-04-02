import { ApiError } from "@api/errors";
import { IUser } from "./user.types";
import { User } from "@api/models";
import { Types } from "mongoose";

export class UserService {
  async getUser(userId: Types.ObjectId | null, authPhone: string | null): Promise<IUser> {
    if (!userId && !authPhone) {
      throw ApiError.badRequest({ msg: "Неверный номер телефона" });
    }
    if (userId) {
      const user = await User.findOne({ _id: userId });
      return user;
    }
    const user = await User.findOne({ authPhone: authPhone });
    return user;
  }

  async createUser(data: {
    email: string;
    login: string;
    hashedPassword: string;
    tariffName: string;
    tariffDuration: number;
  }): Promise<IUser> {
    if (!data) {
      throw ApiError.badRequest({ msg: "Не указаны данные", alert: true });
    }
    const user = await User.create({
      email: data.email,
      login: data.login,
      password: data.hashedPassword,
      name: null,
      tariff: {
        tariffName: data.tariffName,
        tariffDuration: data.tariffDuration,
      },
      lastVisitAt: new Date(),
    });
    return user;
  }

  async updateUserByUserId(userId: Types.ObjectId): Promise<void> {
    const user = await User.updateOne({ userId }, { accepted: true });
  }
}
