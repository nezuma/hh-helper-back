import { ApiErrorProps } from "@types";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors = [],
    public alert: boolean = true
  ) {
    super(message);
  }

  static badRequest(
    { msg, alert }: ApiErrorProps = { msg: "Плохой запрос", alert: true }
  ): ApiError {
    return new ApiError(400, msg, undefined, alert);
  }

  static unAuth(
    { msg, alert }: ApiErrorProps = { msg: "Пользователь не авторизован", alert: true }
  ): ApiError {
    return new ApiError(401, msg, undefined, alert);
  }

  static forbidden(
    { msg, alert }: ApiErrorProps = { msg: "Доступ запрещён", alert: true }
  ): ApiError {
    return new ApiError(403, msg, undefined, alert);
  }

  static noPermission(
    { msg, alert }: ApiErrorProps = { msg: "Недостаточно прав", alert: true }
  ): ApiError {
    return new ApiError(403, msg, undefined, alert);
  }

  static notFound(
    { msg, alert }: ApiErrorProps = { msg: "Не найдено", alert: true }
  ): ApiError {
    return new ApiError(404, msg, undefined, alert);
  }

  static alreadyExists(
    { msg, alert }: ApiErrorProps = { msg: "Уже существует", alert: true }
  ): ApiError {
    return new ApiError(409, msg, undefined, alert);
  }

  static tooManyRequests(
    { msg, alert }: ApiErrorProps = { msg: "Слишком много запросов", alert: true }
  ): ApiError {
    return new ApiError(429, msg, undefined, alert);
  }

  static internalServerError(
    { msg, alert }: ApiErrorProps = { msg: "Внутренняя ошибка сервера", alert: true }
  ): ApiError {
    return new ApiError(500, msg, undefined, alert);
  }

  static badRequestErrors(errors = []): ApiError {
    return new ApiError(400, "Bad Request", errors);
  }
}
