import { FastifyInstance, RegisterOptions } from "fastify";
import { checkDostup, checkToken } from "@api/middlewares";

import {
  tariffsHandler,
  adminMainHandler,
  adminUsersHandler,
  adminTicketHandler,
  adminAnalyticsHandler,
  adminSendMessageOrSwitchStatusHandler,
  updateTariffsHandler,
  deleteTariffsHandler,
  createTariffsHandler,
} from "./handlers";

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
    url: "/admin/tariffs",
    preHandler: [checkToken(), checkDostup()],
    handler: tariffsHandler,
  });

  fastify.route({
    method: "PATCH",
    url: "/admin/tariffs",
    preHandler: [checkToken(), checkDostup()],
    handler: updateTariffsHandler,
  });

  fastify.route({
    method: "DELETE",
    url: "/admin/tariffs",
    preHandler: [checkToken(), checkDostup()],
    handler: deleteTariffsHandler,
  });

  fastify.route({
    method: "POST",
    url: "/admin/tariffs",
    preHandler: [checkToken(), checkDostup()],
    handler: createTariffsHandler,
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
