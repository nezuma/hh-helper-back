export namespace SwaggerContract {
  export enum Tags {
    Auth = "Auth",
    Profile = "Profile",
  }

  export const Config = {
    swagger: {
      info: {
        title: "grow-api",
        version: "1.0.0",
      },
      consumes: ["application/json", "text/xml"],
      produces: ["application/json", "text/xml"],
      tags: [
        {
          name: SwaggerContract.Tags.Auth,
          description: "Маршруты для работы с авторизацией",
        },
      ],
    },
  };

  const schemasResponse = {
    400: {
      type: "object",
      description: "Ошибка валидации",
      properties: {
        type: {
          type: "string",
          example: "error",
        },
        msg: {
          type: "string",
        },
        alert: {
          type: "boolean",
          example: true,
        },
        errors: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["msg", "type", "alert"],
    },
    401: {
      type: "object",
      description: "Пользователь не авторизован",
      properties: {
        type: {
          type: "string",
          example: "error",
        },
        msg: {
          type: "string",
        },
        alert: {
          type: "boolean",
          example: true,
        },
      },
      required: ["msg", "type", "alert"],
    },
    403: {
      type: "object",
      description: "Доступ запрещен",
      properties: {
        type: {
          type: "string",
          example: "error",
        },
        msg: {
          type: "string",
        },
        alert: {
          type: "boolean",
          example: true,
        },
      },
      required: ["msg", "type", "alert"],
    },
    404: {
      type: "object",
      description: "Контент не найден",
      properties: {
        type: {
          type: "string",
          example: "error",
        },
        msg: {
          type: "string",
        },
        alert: {
          type: "boolean",
          example: true,
        },
      },
      required: ["msg", "type"],
    },
    409: {
      type: "object",
      description: "Создание/редактирование сущностей вызывает конфликт",
      properties: {
        type: {
          type: "string",
          example: "error",
        },
        msg: {
          type: "string",
        },
      },
      required: ["msg", "type"],
    },
    429: {
      type: "object",
      description: "Много запросов от пользователя",
      properties: {
        type: {
          type: "string",
          example: "error",
        },
        msg: {
          type: "string",
          example: "Превышен лимит авторизаций за сутки",
        },
        alert: {
          type: "boolean",
          example: true,
        },
      },
      required: ["msg", "type", "alert"],
    },
    500: {
      type: "object",
      description: "Внутреняя ошибка сервера",
      properties: {
        type: {
          type: "string",
          example: "error",
        },
        msg: {
          type: "string",
        },
      },
      required: ["msg", "type"],
    },
    503: {
      type: "object",
      description: "Сервис недоступен",
      properties: {
        type: {
          type: "string",
          example: "error",
        },
        msg: {
          type: "string",
        },
      },
      required: ["msg", "type"],
    },
  };

  type ErrorCode = 400 | 401 | 403 | 404 | 409 | 500 | 503 | 429;

  export const ResponseFactory = (...errorCodes: ErrorCode[]) =>
    errorCodes.reduce(
      (errorTotals, errorCode) => ({
        ...errorTotals,
        [errorCode]: schemasResponse[errorCode],
      }),
      {}
    );
  export const SuccessResponseFactory = ({
    statusCode,
    alert,
    msg,
  }: {
    statusCode: 200 | 201;
    alert: boolean;
    msg: string;
  }) => {
    return {
      [statusCode]: {
        type: "object",
        properties: {
          type: {
            type: "string",
            example: "success",
          },
          alert: {
            type: "boolean",
            example: alert,
          },
          msg: {
            type: "string",
            example: msg,
          },
        },
      },
    };
  };
}
