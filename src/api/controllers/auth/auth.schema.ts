import { FastifySchema } from "fastify";
import { SwaggerContract } from "@contracts/swagger-tags.namespace";

// export const authAcceptSchema: FastifySchema = {
//   tags: [SwaggerContract.Tags.Auth],
//   summary: "Подтверждение телефона",
//   body: {
//     type: "object",
//     required: ["userId", "code"],
//     properties: {
//       userId: {
//         type: "string",
//       },
//       code: {
//         type: "number",
//       },
//     },
//   },
//   response: {
//     ...SwaggerContract.ResponseFactory(400),
//     201: {
//       accessToken: {
//         type: "string",
//         example: "test",
//       },
//       refreshToken: {
//         type: "string",
//         example: "test",
//       },
//       msg: {
//         type: "string",
//         example: "test",
//       },
//       alert: {
//         type: "boolean",
//         example: true,
//       },
//     },
//   },
// };

// export const authCheckSchema: FastifySchema = {
//   tags: [SwaggerContract.Tags.Auth],
//   summary: "Проверка авторизации",
//   body: {
//     type: "object",
//     required: ["accessToken", "refreshToken"],
//     properties: {
//       accessToken: {
//         type: "string",
//       },
//       refreshToken: {
//         type: "string",
//       },
//     },
//   },
//   response: {
//     ...SwaggerContract.ResponseFactory(400),
//     201: {
//       accessToken: {
//         type: "string",
//         example: "test",
//       },
//       alert: {
//         type: "boolean",
//         example: true,
//       },
//     },
//   },
// };

export const registerSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Auth],
  summary: "Регистрация",
  body: {
    type: "object",
    required: ["email", "login", "password", "confirmPassword"],
    properties: {
      email: {
        type: "string",
      },
      login: {
        type: "string",
      },
      password: {
        type: "string",
      },
      confirmPassword: {
        type: "string",
      },
    },
  },
  response: {
    ...SwaggerContract.ResponseFactory(400),
    201: {
      accessToken: {
        type: "string",
      },
      refreshToken: {
        type: "string",
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

export const registerAcceptSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Auth],
  summary: "Подтверждение регистрации",
  querystring: {
    type: "object",
    required: ["token", "email", "userId"],
    properties: {
      token: {
        type: "string",
      },
      email: {
        type: "string",
      },
      userId: {
        type: "string",
      },
    },
  },
  response: {
    ...SwaggerContract.ResponseFactory(400),
    200: {
      accessToken: {
        type: "string",
      },
      refreshToken: {
        type: "string",
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

export const authSchema: FastifySchema = {
  tags: [SwaggerContract.Tags.Auth],
  summary: "Авторизация",
  body: {
    type: "object",
    required: ["login", "password"],
    properties: {
      login: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
  },
  response: {
    ...SwaggerContract.ResponseFactory(400),
    201: {
      type: "object",
      properties: {
        user: {
          type: "object",
        },
        msg: {
          type: "string",
          example: "Успешная авторизация",
        },
        alert: {
          type: "boolean",
          example: true,
        },
      },
    },
  },
};
