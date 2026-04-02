import { FastifyInstance, RegisterOptions } from "fastify";
import {
  authAcceptHandler,
  authCheckHandler,
  authHandler,
  registerAcceptHandler,
  registerHandler,
} from "./handlers";
import {
  authAcceptSchema,
  authCheckSchema,
  authSchema,
  registerSchema,
} from "./auth.schema";

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

  fastify.route({
    method: "POST",
    url: "/register",
    schema: registerSchema,
    handler: registerHandler,
  });
  fastify.route({
    method: "GET",
    url: "/register/accept",
    handler: registerAcceptHandler,
  });

  done();
};
