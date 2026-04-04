import { FastifyInstance, RegisterOptions } from "fastify";
import {
  adminAnalyticsHandler,
  adminMainHandler,
  adminSendMessageOrSwitchStatusHandler,
  adminTicketHandler,
  adminUsersHandler,
} from "./handlers";
import { checkDostup, checkToken } from "@api/middlewares";

export const adminRouter = (
  fastify: FastifyInstance,
  opts: RegisterOptions,
  done?: Function
) => {
  fastify.route({
    method: "GET",
    url: "/admin/main",
    preHandler: [checkToken(), checkDostup()],
    handler: adminMainHandler,
  });

  fastify.route({
    method: "GET",
    url: "/admin/users",
    preHandler: [checkToken(), checkDostup()],
    handler: adminUsersHandler,
  });

  fastify.route({
    method: "GET",
    url: "/admin/analytics",
    preHandler: [checkToken(), checkDostup()],
    handler: adminAnalyticsHandler,
  });

  fastify.route({
    method: "GET",
    url: "/admin/tickets",
    preHandler: [checkToken(), checkDostup()],
    handler: adminTicketHandler,
  });

  fastify.route({
    method: "PATCH",
    url: "/admin/tickets",
    preHandler: [checkToken(), checkDostup()],
    handler: adminSendMessageOrSwitchStatusHandler,
  });

  done();
};
