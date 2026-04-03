import { di } from "@config";
import { appConfig } from "@main";
import { FastifyReply, FastifyRequest } from "fastify";
import { IAuth, AuthService, UserService, CryptoService } from "@api/services";

export const authHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const authService = di.container.resolve<AuthService>("authService");
  const userService = di.container.resolve<UserService>("userService");
  const cryptoService = di.container.resolve<CryptoService>("cryptoService");

  const { login, password }: IAuth = req.body as IAuth;
  if (appConfig.SERVICE_MODE === "dev") {
  }
};
