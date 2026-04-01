import { Tariff } from "@api/models";
import { ITariff } from "./tariff.types";
import { ApiError } from "@api/errors";

export class TariffService {
  constructor() {}

  async getBaseTariff(): Promise<ITariff> {
    const baseTariff = await Tariff.findOne({ key: "base" });
    if (!baseTariff) {
      throw ApiError.notFound({ msg: "Не найден тариф base", alert: true });
    }
    return baseTariff;
  }
}
