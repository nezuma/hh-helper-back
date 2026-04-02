import { di } from "@config";
import { appConfig } from "@main";
import { AuthService, IRegister } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";

export const registerHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const authService = di.container.resolve<AuthService>("authService");
  const data = req.body as IRegister;

  const tokens = await authService.registerUser(data);

  const isLocalhost = appConfig.HOSTNAME === "localhost";

  reply
    .status(201)
    .setCookie("accessToken", tokens.accessToken, {
      path: "/",
      priority: "high",
      domain: appConfig.HOSTNAME,
      partitioned: true,
      maxAge: 15 * 60 * 1000,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "lax" : "none",
    })
    .setCookie("refreshToken", tokens.refreshToken, {
      path: "/",
      priority: "high",
      domain: appConfig.HOSTNAME,
      partitioned: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "lax" : "none",
    })
    .send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      msg: `Регистрация успешна`,
      alert: true,
    });
};
