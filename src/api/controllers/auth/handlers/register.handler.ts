import { di } from "@config";
import { appConfig } from "@main";
import { AuthService, IRegister } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "@api/errors";

export const registerHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  // Подключаем DI контейнер AuthService
  const authService = di.container.resolve<AuthService>("authService");

  // Вытаскиваем из тела запроса данные
  const { email, login, password, confirmPassword } = req.body as IRegister;

  // Проверяем на наличие данных
  if (!email || !login || !password || !confirmPassword) {
    throw ApiError.badRequest({ msg: "Какое-то из полей пустое" });
  }

  // Переходим к процессу регистрации в сервис
  const tokens = await authService.registerUser(
    {
      email,
      login,
      password,
      confirmPassword,
    },
    req.actor.getUserDevice
  );

  // Если сервер на локалке
  const isLocalhost = appConfig.HOSTNAME === "localhost";

  // Возвращаем куки и в ответе на случай локалки токены
  return reply
    .status(201)
    .setCookie("accessToken", tokens.accessToken, {
      path: "/",
      priority: "high",
      domain: appConfig.HOSTNAME,
      partitioned: true,
      maxAge: 15 * 60 * 1000,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "lax" : "none",
    })
    .setCookie("refreshToken", tokens.refreshToken, {
      path: "/",
      priority: "high",
      domain: appConfig.HOSTNAME,
      partitioned: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "lax" : "none",
    })
    .send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      msg: `Регистрация успешна`,
      alert: true,
    });
};
