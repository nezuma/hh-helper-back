import { di } from "@config";
import { IUser, OrderService } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";

export const profileHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const orderService = di.container.resolve<OrderService>("orderService");
  const userId = req.actor.getUser._id;

  const orders = await orderService.getAllOrdersByUserId(userId);

  return reply.send(orders).status(200);
};
