import { FastifySchema } from "fastify";
import { SwaggerContract } from "@contracts";

export const profileSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Profile],
  summary: "Профиль",
  response: {},
};

export const profileOrderSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Profile],
  summary: "Профиль",
  querystring: {
    type: "object",
    properties: {
      id: {
        type: "string",
      },
    },
  },
  response: {},
};
