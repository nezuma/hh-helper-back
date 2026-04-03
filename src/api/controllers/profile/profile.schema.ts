import { FastifySchema } from "fastify";
import { SwaggerContract } from "@contracts";

export const profileSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Profile],
  summary: "Профиль",
  response: {
    200: {
      email: {
        type: "string",
      },
      login: {
        type: "string",
      },
      name: {
        type: "string",
      },
      tariff: {
        type: "object",
        properties: {
          tariffName: {
            type: "string",
          },
          tariffDuration: {
            type: "string",
          },
        },
      },
      accepted: {
        type: "boolean",
      },
      lastVisitAt: {
        type: "string",
      },
    },
  },
};

export const profileTariffSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Profile],
  summary: "Тарифы",
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
