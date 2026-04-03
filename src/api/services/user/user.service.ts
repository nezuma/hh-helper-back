import { ApiError } from "@api/errors";
import { IUser } from "./user.types";
import { User } from "@api/models";
import { Types } from "mongoose";

export class UserService {
  async getUserByEmail(email: string): Promise<IUser> {
    if (!email) {
      throw ApiError.badRequest({ msg: "Неверная ссылка подтверждения", alert: true });
    }
    const user = await User.findOne({ email: email }).lean();
    return user;
  }
  async getUserById(userId: Types.ObjectId, password?: boolean): Promise<IUser> {
    if (!userId) {
      throw ApiError.badRequest({ msg: "Неверная ссылка подтверждения", alert: true });
    }
    const user = await User.findOne(
      { _id: userId },
      typeof password === "boolean" && password === true ? {} : { password: false }
    ).lean();
    return user;
  }

  async createUser(data: {
    email: string;
    login: string;
    hashedPassword: string;
    tariffId: Types.ObjectId;
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
        tariffId: data.tariffId,
        tariffName: data.tariffName,
        tariffDuration: data.tariffDuration,
      },
      lastVisitAt: new Date(),
    });
    return user;
  }

  async switchActivateUser(userId: Types.ObjectId, accepted?: boolean): Promise<IUser> {
    const user = await User.findById(userId);
    await User.updateOne({ _id: userId }, { accepted: accepted ? true : !user.accepted });
    return user;
  }
}
