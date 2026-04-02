import { di } from "@config";
import { appConfig } from "@main";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  AuthLogService,
  AuthService,
  CryptoService,
  IAuth,
  UserService,
} from "@api/services";

export const authHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const authService = di.container.resolve<AuthService>("authService");
  const userService = di.container.resolve<UserService>("userService");
  const cryptoService = di.container.resolve<CryptoService>("cryptoService");
  const authLogService = di.container.resolve<AuthLogService>("authLogService");

  const { authPhone } = req.body as IAuth;
  authService.isValidRussianPhoneNumber(authPhone);

  let user = await userService.getUser(null, authPhone);
  if (!user) {
    // user = await userService.createUser(authPhone);
  }
  const code = authService.generateAuthCode();

  const canCreateNewLog = await authLogService.checkSmsTime(authPhone);

  // if (canCreateNewLog) {
  //   await authLogService.createAuthLog(
  //     authPhone,
  //     user._id,
  //     code,
  //     cryptoService.generateAccessToken(user._id),
  //     cryptoService.generateRefreshToken(user._id)
  //   );
  // }

  if (appConfig.SERVICE_MODE === "dev") {
    return reply.status(201).send({
      userId: user._id,
      authPhone: authPhone,
      code: code,
      msg: "Код успешно отправлен в смс на указанный Вами номер",
      alert: true,
    });
  }
};
