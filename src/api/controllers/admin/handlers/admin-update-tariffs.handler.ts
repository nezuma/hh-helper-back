import { ITariff, TariffService } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const updateTariffsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const tariffService = di.container.resolve<TariffService>("tariffService");
  const data = req.body as ITariff;
  const tariff = await tariffService.updateTariff(data, req.query["tariffId"]);

  return reply.status(200).send(tariff);
};
