import { SwaggerContract } from "@contracts";
import { FastifySchema } from "fastify";

export const profileTariffSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Profile],
  summary: "Пользователи",
  querystring: {
    type: "object",
    properties: {
      skip: {
        type: "number",
      },
      limit: {
        type: "number",
      },
    },
  },
  response: {},
};
