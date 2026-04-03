import { di } from "@config";
import { appConfig } from "@main";
import { FastifyReply, FastifyRequest } from "fastify";
import { IAuth, AuthService, UserService, CryptoService } from "@api/services";

export const authHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const authService = di.container.resolve<AuthService>("authService");

  const { login, password }: IAuth = req.body as IAuth;

  const { user, tokens } = await authService.authenticateUser(
    { login, password },
    req.actor.getUserDevice
  );

  return reply.status(200).send({ profile: user, tokens });
};
