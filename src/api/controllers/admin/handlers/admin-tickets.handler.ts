import { di } from "@config";
import { TicketService } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";

export const adminTicketHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const ticketService = di.container.resolve<TicketService>("ticketService");
  const ticketId = req.query["ticketId"];
  if (ticketId) {
    const ticket = await ticketService.getTicketById(ticketId);
    return ticket;
  }

  const total = await ticketService.getTotalTicketsForAdminPanel();
  const tickets = await ticketService.getAllTicketsForAdminPanel(
    req.pagination,
    req.query["status"],
    req.query["category"],
    req.query["query"]
  );

  return reply.status(200).send({
    total: total,
    tickets: tickets,
  });
};
