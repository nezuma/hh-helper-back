import { AuthService, IRegister } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const registerHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const authService = di.container.resolve<AuthService>("authService");
  const data = req.body as IRegister;

  await authService.registerUser(data);
};
