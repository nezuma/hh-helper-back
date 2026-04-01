import { di } from "@config";
import { AuthService, ITokens } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";
import { appConfig } from "@main";

export const authCheckHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const authService = di.container.resolve<AuthService>("authService");
  const { accessToken, refreshToken } = req.body as ITokens;

  const newToken = await authService.verifyAutorizationToken(accessToken, refreshToken);

  const isLocalhost = appConfig.HOSTNAME === "localhost";
  if (typeof newToken == "string") {
    reply.setCookie("accessToken", newToken, {
      path: "/",
      priority: "high",
      domain: appConfig.HOSTNAME,
      partitioned: true,
      maxAge: 15 * 60 * 1000,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "lax" : "none",
    });
  }

  return reply.status(201).send({ accessToken: newToken, alert: false });
};
