import { OID } from "@api/helpers";
import { TicketService } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const adminSendMessageOrSwitchStatusHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const ticketService = di.container.resolve<TicketService>("ticketService");
  const data = req.body;
  const ticket = await ticketService.adminSendMessageOrSwitchStatus({
    ticketId: OID(req.query["ticketId"]),
    user: req.actor.getUser,
    status: req.query["status"],
    data,
  });

  return reply.status(200).send(ticket);
};
