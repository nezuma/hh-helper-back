import { OID } from "@api/helpers";
import { TicketService } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const sendMessageOrCloseTicketHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const ticketService = di.container.resolve<TicketService>("ticketService");
  const body = req.body;
  const response = await ticketService.sendMessageOrCloseTicket({
    data: body,
    user: req.actor.getUser,
    ticketId: OID(req.query["ticketId"]),
    close: req.query["close"],
  });

  return reply.status(200).send(response);
};
