import { ApiError } from "@api/errors";
import { FastifyMiddleware } from "@types";
import { FastifyReply, FastifyRequest } from "fastify";

export function checkDostup(): FastifyMiddleware {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const userRole = req.actor.getUser.role;
    if (userRole == "admin" || userRole == "moder") {
      reply.setCookie("dostup", userRole, {
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
      });
      return;
    }
    throw ApiError.noPermission({ msg: "Нет прав", alert: true });
  };
}
