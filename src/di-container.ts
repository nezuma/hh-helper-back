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
  RegisterLogService,
  AdminService,
} from "@api/services";

export const enableServiceInjection = () => {
  di.container.register({
    authService: asClass(AuthService).singleton(),
    userService: asClass(UserService).singleton(),
    mailService: asClass(MailService).singleton(),
    orderService: asClass(OrderService).singleton(),
    adminService: asClass(AdminService).singleton(),
    tariffService: asClass(TariffService).singleton(),
    cryptoService: asClass(CryptoService).singleton(),
    authLogService: asClass(AuthLogService).singleton(),
    registerLogService: asClass(RegisterLogService).singleton(),
  });
};
