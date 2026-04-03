import { Tariff } from "@api/models";
import { ITariff } from "./tariff.types";
import { ApiError } from "@api/errors";
import { Pagination } from "@types";

export class TariffService {
  constructor() {}

  async getBaseTariff(): Promise<ITariff> {
    const baseTariff = await Tariff.findOne({ key: "base" });
    if (!baseTariff) {
      throw ApiError.notFound({ msg: "Не найден тариф base", alert: true });
    }
    return baseTariff;
  }

  async getAllTariffs(pagination: Pagination): Promise<ITariff[]> {
    const tariffs = await Tariff.find().skip(pagination.skip).limit(pagination.limit);
    if (!tariffs) {
      throw ApiError.notFound({ msg: "Тарифов нет", alert: true });
    }
    return tariffs;
  }
}
