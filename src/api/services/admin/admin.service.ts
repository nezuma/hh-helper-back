import { Pagination } from "@types";
import { UserService } from "../user";
import { TariffService } from "../tariff";

export class AdminService {
  constructor(
    private userService: UserService,
    private tariffService: TariffService
  ) {}

  async getMainAdminStats() {
    const usersCount = await this.userService.getAllUsersCount();
    const newUsersCount = await this.userService.getAllUsersCountInLastDay();
    const usersCountWithTariffs = await this.userService.getAllUsersCountWithTariff();
    const adminsCount = await this.userService.getAllAdminUsers();

    return {
      usersCount,
      newUsersCount,
      usersCountWithTariffs,
      adminsCount,
    };
  }

  async getAnalytics() {
    const stats = {
      totalUsers: 0,
      activeSubscriptions: 0,
      newUsersToday: 0,
      newUsersWeek: 0,
      totalResponses: 0, // пока нет
      responsesToday: 0, // пока нет
      responsesWeek: 0, // пока нет
      activeBots: 0, // пока нет
      revenueMonth: 0, // пока нет
      revenueTotal: 0, // пока нет
      popularTariff: "",
      usersByTariff: {},
    };
    const mainStats = await this.getMainAdminStats();

    const popularTariff = await this.tariffService.getPopularTariff();

    stats.totalUsers = mainStats.usersCount;
    stats.activeSubscriptions = mainStats.usersCountWithTariffs;
    stats.newUsersToday = mainStats.newUsersCount;
    stats.newUsersWeek = await this.userService.getAllUsersCountInLastWeek();
    stats.popularTariff = popularTariff ? popularTariff.name : "Нет";
    stats.usersByTariff = await this.userService.getCountUsersWithAllTariffs();

    return stats;
  }
}
