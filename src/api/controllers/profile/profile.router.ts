import { checkToken } from "@api/middlewares";
import { profileHandler, profileTariffHandler } from "./handlers";
import { profileTariffSchema, profileSchema } from "./profile.schema";
import { FastifyInstance, RegisterOptions } from "fastify";

export const profileRouter = (
  fastify: FastifyInstance,
  opts: RegisterOptions,
  done?: Function
) => {
  fastify.route({
    method: "GET",
    url: "/profile",
    preHandler: [checkToken()],
    schema: profileSchema,
    handler: profileHandler,
  });

  fastify.route({
    method: "GET",
    url: "/profile/tariffs",
    preHandler: [checkToken()],
    schema: profileTariffSchema,
    handler: profileTariffHandler,
  });

  done();
};
