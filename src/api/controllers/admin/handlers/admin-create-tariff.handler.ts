import { ITariff, TariffService } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const createTariffsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const tariffService = di.container.resolve<TariffService>("tariffService");

  const data = req.body as ITariff;

  const tariff = await tariffService.createTariff(data);

  return reply.status(200).send({
    msg: "Тариф удален успешно",
    alert: true,
    success: true,
  });
};
