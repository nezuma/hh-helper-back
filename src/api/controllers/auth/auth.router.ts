import { FastifyInstance, RegisterOptions } from "fastify";
import { authAcceptHandler, authCheckHandler, authHandler } from "./handlers";
import { authAcceptSchema, authCheckSchema, authSchema } from "./auth.schema";

export const authRouter = (
  fastify: FastifyInstance,
  opts: RegisterOptions,
  done?: Function
) => {
  fastify.route({
    method: "POST",
    url: "/auth",
    schema: authSchema,
    handler: authHandler,
  });

  fastify.route({
    method: "PATCH",
    url: "/auth-accept",
    schema: authAcceptSchema,
    handler: authAcceptHandler,
  });

  fastify.route({
    method: "PATCH",
    url: "/auth-check",
    schema: authCheckSchema,
    handler: authCheckHandler,
  });

  done();
};
