import { di } from "@config";
import { asClass } from "awilix";
import {
  AuthService,
  UserService,
  MailService,
  OrderService,
  CryptoService,
  TariffService,
  AuthLogService,
} from "@api/services";

export const enableServiceInjection = () => {
  di.container.register({
    authService: asClass(AuthService).singleton(),
    userService: asClass(UserService).singleton(),
    mailService: asClass(MailService).singleton(),
    orderService: asClass(OrderService).singleton(),
    tariffService: asClass(TariffService).singleton(),
    cryptoService: asClass(CryptoService).singleton(),
    authLogService: asClass(AuthLogService).singleton(),
  });
};
