import { OID } from "@api/helpers";
import { TicketService } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const ticketsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const ticketService = di.container.resolve<TicketService>("ticketService");
  const user = req.actor.getUser;

  const ticketId = req.query["id"];
  if (ticketId) {
    const ticket = await ticketService.getTicketById(OID(ticketId));

    return reply.status(200).send(ticket);
  }
  const tickets = await ticketService.getAllTicketsByUserId(user._id);
  return reply.status(200).send(tickets);
};
