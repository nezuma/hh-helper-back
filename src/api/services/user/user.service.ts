import { ApiError } from "@api/errors";
import { IUser } from "./user.types";
import { User } from "@api/models";
import { Types } from "mongoose";
import { CryptoService } from "../auth";
import { Pagination } from "@types";
import { TariffService } from "../tariff";

export class UserService {
  constructor(
    private cryptoService: CryptoService,
    private tariffService: TariffService
  ) {}
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

  async changeUserPassword({
    oldPassword,
    newPassword,
    confirmNewPassword,
    userId,
  }): Promise<IUser> {
    if (!userId) {
      throw ApiError.badRequest({ msg: "Вы не авторизованы!", alert: true });
    }
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      throw ApiError.badRequest({ msg: "Какой-то пароль не верный", alert: true });
    }

    if (newPassword !== confirmNewPassword) {
      throw ApiError.badRequest({ msg: "Пароли не совпадают", alert: true });
    }

    if (newPassword.length <= 5) {
      throw ApiError.badRequest({ msg: "Новый пароль слишком короткий", alert: true });
    }

    const user = await User.findById(userId);

    if (user.password !== this.cryptoService.encodeToSHA256(oldPassword)) {
      throw ApiError.noPermission({ msg: "Пароль введен неверно", alert: true });
    }

    await User.updateOne(
      { _id: userId },
      { password: this.cryptoService.encodeToSHA256(newPassword) }
    );

    return user;
  }

  async changeUserName(newName: string, userId: Types.ObjectId): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { name: newName },
      { new: true }
    ).lean();
    return user;
  }

  async getAllUsers(pagination: Pagination): Promise<IUser[]> {
    const users = await User.find().skip(pagination.skip).limit(pagination.limit).lean();

    return users;
  }

  async getAllUsersCount(): Promise<number> {
    const userCount = await User.countDocuments();
    return userCount;
  }

  async getAllUsersCountInLastDay(): Promise<number> {
    const lastDay = Number(new Date()) - 1 * 24 * 60 * 60 * 1000;
    const newUsersCount = await User.countDocuments({ createdAt: { $gte: lastDay } });

    return newUsersCount;
  }

  async getAllUsersCountWithTariff(): Promise<number> {
    const baseTariff = await this.tariffService.getBaseTariff();

    const countUsersWithTariff = await User.countDocuments({
      "tariff.tariffId": { $ne: baseTariff._id },
    });

    return countUsersWithTariff;
  }

  async getAllAdminUsers(): Promise<number> {
    const usersCount = await User.countDocuments({
      role: { $in: ["admin", "moder"] },
    });
    console.log(usersCount);
    return usersCount;
  }

  async getAllUsersCountInLastWeek(): Promise<number> {
    const lastDay = Number(new Date()) - 7 * 24 * 60 * 60 * 1000;
    const newUsersCount = await User.countDocuments({ createdAt: { $gte: lastDay } });

    return newUsersCount;
  }

  async getCountUsersWithAllTariffs(): Promise<object> {
    const tariffs = await this.tariffService.getAllTariffs();
    const result = await User.aggregate([
      {
        $match: {
          "tariff.tariffId": { $in: tariffs.map((t) => t._id) },
        },
      },
      {
        $group: {
          _id: "$tariff.tariffId",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts: Record<string, number> = {};
    tariffs.forEach((tariff) => {
      const found = result.find((r) => r._id.toString() === tariff._id.toString());
      counts[tariff.key] = found?.count || 0; // или tariff.key
    });
    return counts;
  }
}
