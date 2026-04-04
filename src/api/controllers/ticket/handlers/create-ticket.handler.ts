import { ICreateTicket, TicketService } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const createTicketHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const ticketService = di.container.resolve<TicketService>("ticketService");

  const { title, description } = req.body as ICreateTicket;

  const category = req.query["category"];

  const user = req.actor.getUser;

  const newTicket = await ticketService.createTicket(
    { title, description },
    category,
    user
  );

  return reply.status(200).send({
    ticket: newTicket,
    msg: "Ваше обращение успешно создано!",
    alert: true,
  });
};
