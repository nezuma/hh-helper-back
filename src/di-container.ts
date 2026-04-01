import { di } from "@config";
import { asClass } from "awilix";
import {
  AuthService,
  UserService,
  OrderService,
  CryptoService,
  AuthLogService,
} from "@api/services";
import { TariffService } from "@api/services/tariff";

export const enableServiceInjection = () => {
  di.container.register({
    authService: asClass(AuthService).singleton(),
    userService: asClass(UserService).singleton(),
    orderService: asClass(OrderService).singleton(),
    tariffService: asClass(TariffService).singleton(),
    cryptoService: asClass(CryptoService).singleton(),
    authLogService: asClass(AuthLogService).singleton(),
  });
};
