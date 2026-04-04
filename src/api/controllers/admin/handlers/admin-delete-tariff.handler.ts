import { ITariff, TariffService } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const deleteTariffsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const tariffService = di.container.resolve<TariffService>("tariffService");
  await tariffService.deleteTariff(req.query["tariffId"]);

  return reply.status(200).send({
    msg: "Тариф удален успешно",
    alert: true,
    success: true,
  });
};
