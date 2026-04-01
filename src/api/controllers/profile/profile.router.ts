import { checkToken } from "@api/middlewares";
import { profileHandler, profileOrderHandler } from "./handlers";
import { profileOrderSchema, profileSchema } from "./profile.schema";
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
    url: "/profile/order",
    preHandler: [checkToken()],
    schema: profileOrderSchema,
    handler: profileOrderHandler,
  });

  done();
};
