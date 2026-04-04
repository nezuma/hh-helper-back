import { FastifyInstance, RegisterOptions } from "fastify";
import { checkToken } from "@api/middlewares";
import {
  createTicketHandler,
  sendMessageOrCloseTicketHandler,
  ticketsHandler,
} from "./handlers";

export const ticketRouter = (
  fastify: FastifyInstance,
  opts: RegisterOptions,
  done?: Function
) => {
  fastify.route({
    method: "GET",
    url: "/tickets",
    preHandler: [checkToken()],
    handler: ticketsHandler,
  });

  fastify.route({
    method: "POST",
    url: "/tickets",
    preHandler: [checkToken()],
    handler: createTicketHandler,
  });

  fastify.route({
    method: "PATCH",
    url: "/tickets",
    preHandler: [checkToken()],
    handler: sendMessageOrCloseTicketHandler,
  });

  done();
};
