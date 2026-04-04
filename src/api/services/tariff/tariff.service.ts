import { Tariff } from "@api/models";
import { ITariff } from "./tariff.types";
import { ApiError } from "@api/errors";
import { Types } from "mongoose";

export class TariffService {
  constructor() {}

  async getBaseTariff(): Promise<ITariff> {
    const baseTariff = await Tariff.findOne({ key: "base" });
    if (!baseTariff) {
      throw ApiError.notFound({ msg: "Не найден тариф base", alert: true });
    }
    return baseTariff;
  }

  async getAllTariffs(): Promise<ITariff[]> {
    const tariffs = await Tariff.find();
    if (!tariffs) {
      throw ApiError.notFound({ msg: "Тарифов нет", alert: true });
    }
    return tariffs;
  }

  async getPopularTariff(): Promise<ITariff> {
    const popularTariff = await Tariff.findOne({ popular: true }).lean();
    return popularTariff;
  }

  async getAllTariffsForAdmin(tariffName: string): Promise<ITariff[]> {
    const match: any = {};

    if (tariffName && tariffName.trim()) {
      // Разбиваем поисковый запрос на отдельные слова
      const searchTerms = tariffName.trim().split(/\s+/);
      const orConditions: any[] = [];

      for (const term of searchTerms) {
        // Экранируем специальные символы regex
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // Ищем по имени тарифа с учетом опечаток через regex
        orConditions.push({ tariffName: { $regex: escapedTerm, $options: "i" } });
      }

      match.$or = orConditions;
      const tariffs = await Tariff.find(match).lean().sort({ price: 1 }).lean();
      return tariffs;
    }
    const tariffs = await Tariff.find().lean();

    return tariffs;
  }

  async updateTariff(data: ITariff, tariffId: Types.ObjectId): Promise<ITariff> {
    if (!data.name || !data.key || !data.price) {
      throw ApiError.badRequest({ msg: "Поля не должны быть пустыми", alert: true });
    }
    if (!tariffId) {
      throw ApiError.badRequest({ msg: "Недействительный тариф", alert: true });
    }

    try {
      const tariff = await Tariff.findByIdAndUpdate(
        tariffId,
        {
          name: data.name,
          duration: data.duration,
          key: data.key,
          price: data.price,
          popular: data.popular ? data.popular : false,
          features: data.features,
        },
        { new: true }
      );

      return tariff;
    } catch (e) {
      console.log(e);
    }
  }

  async deleteTariff(tariffId: Types.ObjectId): Promise<void> {
    if (!tariffId) {
      throw ApiError.badRequest({ msg: "Тариф недействителен", alert: true });
    }

    try {
      await Tariff.deleteOne({ _id: tariffId });
      return;
    } catch (e) {
      console.log(e);
    }
  }

  async createTariff(data: ITariff): Promise<ITariff> {
    // 1. Проверка наличия обязательных полей
    if (!data.name || data.name.trim() === "") {
      throw new Error("Название тарифа обязательно");
    }

    if (!data.key || data.key.trim() === "") {
      throw new Error("Ключ тарифа обязателен");
    }

    // 2. Проверка длины полей
    if (data.name.length < 2) {
      throw new Error("Название тарифа должно содержать минимум 2 символа");
    }

    if (data.name.length > 50) {
      throw new Error("Название тарифа не может превышать 50 символов");
    }

    if (data.key.length < 2) {
      throw new Error("Ключ тарифа должен содержать минимум 2 символа");
    }

    if (data.key.length > 30) {
      throw new Error("Ключ тарифа не может превышать 30 символов");
    }

    // 3. Проверка формата ключа (только латиница, цифры, дефис, подчеркивание)
    const keyRegex = /^[a-zA-Z0-9_-]+$/;
    if (!keyRegex.test(data.key)) {
      throw new Error(
        "Ключ тарифа может содержать только латинские буквы, цифры, дефис и подчеркивание"
      );
    }

    // 4. Проверка цены
    if (data.price === undefined || data.price === null) {
      throw new Error("Цена тарифа обязательна");
    }

    if (typeof data.price !== "number") {
      throw new Error("Цена должна быть числом");
    }

    if (data.price < 0) {
      throw new Error("Цена не может быть отрицательной");
    }

    if (data.price > 1000000) {
      throw new Error("Цена не может превышать 1 000 000 ₽");
    }

    // 5. Проверка длительност
    if (data.duration > 365) {
      throw new Error("Длительность не может превышать 365 дней");
    }

    // 6. Проверка популярности (boolean)
    if (typeof data.popular !== "boolean") {
      throw new Error("Поле 'popular' должно быть булевым значением");
    }

    // 7. Проверка features
    if (!data.features) {
      throw new Error("Не указаны возможности тарифа");
    }

    const requiredFeatures = [
      "choose_response",
      "main_page",
      "activate_bot",
      "autoresponse",
      "autoboost_vacancy",
      "priority_help",
    ];

    for (const feature of requiredFeatures) {
      if (typeof data.features[feature as keyof typeof data.features] !== "boolean") {
        throw new Error(`Поле '${feature}' должно быть булевым значением`);
      }
    }

    // 8. Проверка на существование тарифа с таким же ключом
    const existingTariffByKey = await Tariff.findOne({ key: data.key });
    if (existingTariffByKey) {
      throw new Error(`Тариф с ключом "${data.key}" уже существует`);
    }

    // 9. Проверка на существование тарифа с таким же названием
    const existingTariffByName = await Tariff.findOne({ name: data.name });
    if (existingTariffByName) {
      throw new Error(`Тариф с названием "${data.name}" уже существует`);
    }

    // 10. Если популярный тариф уже есть, снимаем флаг с других
    if (data.popular) {
      await Tariff.updateMany({ popular: true }, { $set: { popular: false } });
    }

    // 11. Создание тарифа
    try {
      const newTariff = await Tariff.create({
        name: data.name.trim(),
        key: data.key.trim().toLowerCase(),
        price: data.price,
        duration: data.duration || null,
        popular: data.popular,
        features: {
          choose_response: data.features.choose_response,
          main_page: data.features.main_page,
          activate_bot: data.features.activate_bot,
          autoresponse: data.features.autoresponse,
          autoboost_vacancy: data.features.autoboost_vacancy,
          priority_help: data.features.priority_help,
        },
      });

      return newTariff;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Тариф с таким ключом или названием уже существует");
      }
      throw new Error(`Ошибка создания тарифа: ${error.message}`);
    }
  }
}
