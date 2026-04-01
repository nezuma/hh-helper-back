import { ApiError } from "@api/errors";
import { OID } from "@api/helpers";
import { AuthService, IAuthAccept } from "@api/services";
import { di } from "@config";
import { appConfig } from "@main";
import { FastifyReply, FastifyRequest } from "fastify";

export const authAcceptHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const authService = di.container.resolve<AuthService>("authService");
  const { userId, code } = req.body as IAuthAccept;

  if ((!userId && !code) || !userId || !code) {
    throw ApiError.badRequest({ msg: "Какое-то поле не указано", alert: true });
  }

  const authLog = await authService.registratingUserProcess(OID(userId), code);

  const isLocalhost = appConfig.HOSTNAME === "localhost";

  return reply
    .status(201)
    .setCookie("accessToken", authLog.accessToken, {
      path: "/",
      priority: "high",
      domain: appConfig.HOSTNAME,
      partitioned: true,
      maxAge: 15 * 60 * 1000,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "lax" : "none",
    })
    .setCookie("refreshToken", authLog.refreshToken, {
      path: "/",
      priority: "high",
      domain: appConfig.HOSTNAME,
      partitioned: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "lax" : "none",
    })
    .send({
      accessToken: authLog.accessToken,
      refreshToken: authLog.refreshToken,
      msg: `Авторизация успешна`,
      alert: true,
    });
};
