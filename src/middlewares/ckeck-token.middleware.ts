import { ApiError } from "@api/errors";
import { FastifyMiddleware } from "@types";
import { FastifyReply, FastifyRequest } from "fastify";

export type AuthOptions = Partial<{
  /**
   * Указать `true`, если не выбрасывать ошибку на неавторизованного пользователя
   */
  allowUnauthorized: boolean;
}>;

export function checkToken(): FastifyMiddleware {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const accessToken = req.cookies.accessToken as string;
    const refreshToken = req.cookies.refreshToken as string;
    console.log(req.cookies);
    if (!accessToken && !refreshToken) {
      throw ApiError.unAuth({ msg: "Не авторизован:", alert: true });
    }
    const newAccessToken = await req.actor.tryAuth(accessToken, refreshToken);
    if (newAccessToken) {
      reply.setCookie("accessToken", newAccessToken, {
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
      });
    }
  };
}
