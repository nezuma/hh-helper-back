import { ApiError } from "@api/errors";
import { MongooseError } from "mongoose";
import { appLogger } from "@winston-logger";
import { JsonWebTokenError } from "jsonwebtoken";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export async function apiErrorHandler(
  error: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply
) {
  const isMongooseError = error instanceof MongooseError;
  const isApiError = error instanceof ApiError;
  const isJsonWebTokenError = error instanceof JsonWebTokenError;
  const isSyntaxError = error instanceof SyntaxError;
  const isNotMultipartError = error.message === "the request is not multipart";
  /**
   * Если приходит ошибка валидации
   */
  if (error?.code == "FST_ERR_VALIDATION") {
    return reply.code(400).send({
      alert: true,
      type: "error",
      msg: "Ошибка валидации",
      errors: error.validation.map((error) => error.message),
    });
  }

  if (error?.code == "FST_ERR_CTP_INVALID_JSON_BODY") {
    return reply.code(400).send({
      alert: true,
      type: "error",
      msg: "Требуется JSON",
      errors: error.validation.map((error) => error.message),
    });
  }

  if (error?.code == "FST_REQ_FILE_TOO_LARGE") {
    return reply.code(400).send({
      alert: true,
      type: "error",
      msg: "Загружаемый файл слишком большой",
    });
  }

  if (error?.code == "FST_ERR_CTP_INVALID_MEDIA_TYPE") {
    return reply.code(400).send({
      alert: false,
      type: "error",
      msg: "Поддерживается только Content-Type: application/json или text/plain",
    });
  }

  if (error?.code == "FST_ERR_CTP_EMPTY_JSON_BODY") {
    return reply.code(error?.statusCode).send({
      alert: false,
      type: "error",
      msg: `${error?.message}`,
    });
  }
  if (isApiError || isMongooseError) {
    const statusCode = isMongooseError ? 500 : error.statusCode;
    return reply.code(statusCode).send({
      alert: error instanceof ApiError && error?.alert,
      type: "error",
      msg: error.message,
    });
  }

  if (isJsonWebTokenError) {
    return reply.code(403).send({
      alert: true,
      type: "error",
      msg: "Неверный токен авторизации",
    });
  }

  if (isSyntaxError) {
    return reply.code(400).send({
      alert: true,
      type: "error",
      msg: "Синтаксическая ошибка",
    });
  }

  if (isNotMultipartError) {
    return reply.code(400).send({
      alert: true,
      type: "error",
      msg: "Выберите файл",
    });
  }

  /**
   * Обязательно напечатаем необработанную ошибку
   */
  appLogger.fatal(error.message);
  console.error(error);

  return reply.code(500).send({
    alert: true,
    type: "error",
    msg: "Непредвиденная ошибка",
  });
}
