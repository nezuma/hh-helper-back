// handlers/hhAuth.ts
import { ApiError } from "@api/errors";
import { FastifyReply, FastifyRequest } from "fastify";

interface IAuthBody {
  username: string;
  password: string;
}

// Получение данных после авторизации
export const hhNegotiationsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { page = "0", filter = "active" } = req.query as any;
    const cookies = req.headers.cookie;

    if (!cookies) {
      throw ApiError.badRequest({
        alert: true,
        msg: "Не авторизован. Выполните вход сначала.",
      });
    }

    const hhUrl = new URL("https://ramenskoe.hh.ru/applicant/negotiations");
    hhUrl.searchParams.append("filter", filter);
    hhUrl.searchParams.append("page", page);

    const response = await fetch(hhUrl.toString(), {
      method: "GET",
      headers: {
        Cookie: cookies,
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw ApiError.badRequest({
        alert: true,
        msg: `Ошибка: ${response.status}`,
      });
    }

    const data = await response.json();
    return reply.status(200).send(data);
  } catch (error) {
    console.error("Ошибка:", error);
    return reply.status(500).send({
      success: false,
      alert: true,
      message: "Внутренняя ошибка сервера",
    });
  }
};
