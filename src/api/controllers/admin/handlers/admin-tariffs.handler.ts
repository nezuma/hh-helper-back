import { TariffService } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const tariffsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const tariffService = di.container.resolve<TariffService>("tariffService");

  const tariffs = await tariffService.getAllTariffsForAdmin(req.query["tariffName"]);

  return reply.status(200).send(tariffs);
};
