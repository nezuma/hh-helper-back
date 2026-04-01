import { FastifySchema } from "fastify";
import { SwaggerContract } from "@contracts/swagger-tags.namespace";
export const authSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Auth],
  summary: "Регистрация",
  body: {
    type: "object",
    required: ["authPhone"],
    properties: {
      authPhone: {
        type: "string",
      },
    },
  },
  response: {
    ...SwaggerContract.ResponseFactory(400),
    201: {
      type: "object",
      properties: {
        userId: {
          type: "string",
          example: "698f74099cd03985d45d4c2b",
        },
        code: {
          type: "number",
          example: 3124,
        },
        msg: {
          type: "string",
          example: "Код успешно отправлен в смс на указанный Вами номер",
        },
        alert: {
          type: "boolean",
          example: true,
        },
      },
    },
  },
};

export const authAcceptSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Auth],
  summary: "Подтверждение телефона",
  body: {
    type: "object",
    required: ["userId", "code"],
    properties: {
      userId: {
        type: "string",
      },
      code: {
        type: "number",
      },
    },
  },
  response: {
    ...SwaggerContract.ResponseFactory(400),
    201: {
      accessToken: {
        type: "string",
        example: "test",
      },
      refreshToken: {
        type: "string",
        example: "test",
      },
      msg: {
        type: "string",
        example: "test",
      },
      alert: {
        type: "boolean",
        example: true,
      },
    },
  },
};

export const authCheckSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Auth],
  summary: "Проверка авторизации",
  body: {
    type: "object",
    required: ["accessToken", "refreshToken"],
    properties: {
      accessToken: {
        type: "string",
      },
      refreshToken: {
        type: "string",
      },
    },
  },
  response: {
    ...SwaggerContract.ResponseFactory(400),
    201: {
      accessToken: {
        type: "string",
        example: "test",
      },
      alert: {
        type: "boolean",
        example: true,
      },
    },
  },
};
