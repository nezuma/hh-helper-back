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

export const profileSettingsSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Profile],
  summary: "Настройки",
  querystring: {
    type: "object",
    properties: {
      settingType: {
        type: "string",
        enum: ["changePassword", "changeName"],
      },
    },
    required: ["settingType"],
  },
  body: {
    type: "object",
    properties: {
      oldPassword: {
        type: "string",
      },
      newPassword: {
        type: "string",
      },
      confirmNewPassword: {
        type: "string",
      },
      newName: {
        type: "string",
      },
    },
    allOf: [
      {
        if: {
          properties: { settingType: { const: "changePassword" } },
        },
        then: {
          required: ["oldPassword", "newPassword", "confirmNewPassword"],
        },
      },
      {
        if: {
          properties: { settingType: { const: "chaneName" } },
        },
        then: {
          required: ["newName"],
        },
      },
    ],
  },
};
