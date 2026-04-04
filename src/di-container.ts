import { di } from "@config";
import { asClass } from "awilix";
import {
  AuthService,
  UserService,
  MailService,
  AdminService,
  CryptoService,
  TariffService,
  TicketService,
  AuthLogService,
  RegisterLogService,
} from "@api/services";

export const enableServiceInjection = () => {
  di.container.register({
    authService: asClass(AuthService).singleton(),
    userService: asClass(UserService).singleton(),
    mailService: asClass(MailService).singleton(),
    adminService: asClass(AdminService).singleton(),
    tariffService: asClass(TariffService).singleton(),
    cryptoService: asClass(CryptoService).singleton(),
    ticketService: asClass(TicketService).singleton(),
    authLogService: asClass(AuthLogService).singleton(),
    registerLogService: asClass(RegisterLogService).singleton(),
  });
};
