import { di } from "@config";
import { OrderService } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";
import { OID } from "@api/helpers";

export const profileOrderHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  console.log(req.query["id"]);
  const orderId = req.query["id"];
  const orderService = di.container.resolve<OrderService>("orderService");

  const OIDOrderId = OID(orderId);
  const orderInfo = orderService.getOrderById(OIDOrderId);

  return reply.status(200).send(orderInfo);
};
