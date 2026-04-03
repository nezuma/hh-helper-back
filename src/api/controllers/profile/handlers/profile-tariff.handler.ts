import { di } from "@config";
import { TariffService } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";

export const profileTariffHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const tariffService = di.container.resolve<TariffService>("tariffService");

  const tariffs = await tariffService.getAllTariffs();

  return reply.status(200).send(tariffs);
};
