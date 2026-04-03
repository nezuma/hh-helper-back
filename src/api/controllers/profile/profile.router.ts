import { checkToken } from "@api/middlewares";
import {
  hhLoginHandler,
  hhNegotiationsHandler,
  profileHandler,
  profileTariffHandler,
} from "./handlers";
import { profileTariffSchema, profileSchema } from "./profile.schema";
import { FastifyInstance, RegisterOptions } from "fastify";
import { profileSettingsHandler } from "./handlers/profile-settings.handler";

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

  fastify.route({
    method: "PATCH",
    url: "/profile/settings",
    preHandler: [checkToken()],
    handler: profileSettingsHandler,
  });

  fastify.route({
    method: "POST",
    url: "/profile/hh/login",
    preHandler: [checkToken()],
    handler: hhLoginHandler,
  });

  fastify.route({
    method: "GET",
    url: "/profile/hh/negotiations",
    preHandler: [checkToken()],
    handler: hhNegotiationsHandler,
  });

  done();
};
