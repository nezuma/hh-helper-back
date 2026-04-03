import { OID } from "@api/helpers";
import { AuthService, IAcceptRegister } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const registerAcceptHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const authService = di.container.resolve<AuthService>("authService");
  const { token, email, userId }: IAcceptRegister = {
    token: req.query["token"],
    email: req.query["email"],
    userId: OID(req.query["userId"]),
  };
  const regLog = await authService.registerUserAccept({ token, email, userId });

  return reply.status(200).send({
    accessToken: regLog.accessToken,
    refreshToken: regLog.refreshToken,
    msg: "Ваша почта успешно подтверждена",
    alert: true,
  });
};
