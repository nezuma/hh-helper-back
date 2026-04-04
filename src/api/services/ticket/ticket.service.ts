import { IUser } from "../user";
import { Types } from "mongoose";
import { Ticket } from "@api/models";
import { ApiError } from "@api/errors";
import { ICreateTicket, ITicket } from "./ticket.types";
import { Pagination } from "@types";
import { OID } from "@api/helpers";

export class TicketService {
  async getAllTicketsByUserId(userId: Types.ObjectId): Promise<ITicket[]> {
    const tickets = await Ticket.find({ userId: userId }).sort({ updatedAt: -1 }).lean();

    return tickets;
  }

  async getTicketById(ticketId: Types.ObjectId): Promise<ITicket> {
    const ticket = await Ticket.findById(ticketId).lean();

    return ticket;
  }

  async createTicket(
    ticketFrom: ICreateTicket,
    ticketCategory: "help" | "propose",
    user: IUser
  ): Promise<ITicket> {
    if (ticketFrom.title.length < 3 || ticketFrom.title.length > 200) {
      throw ApiError.badRequest({
        msg: "Заголовок должен содержать минимум 3 символа и не может превышать 200 символов",
        alert: true,
      });
    }
    if (ticketFrom.description.length < 10 || ticketFrom.description.length > 5000) {
      throw ApiError.badRequest({
        msg: "Описание должно содержать минимум 10 символов и не может превышать 5000 символов",
        alert: true,
      });
    }

    const lastTicket = await Ticket.findOne({
      userId: user._id,
    }).sort({ createdAt: -1 });

    function getMinutesWord(minutes: number): string {
      const lastDigit = minutes % 10;
      const lastTwoDigits = minutes % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "минут";
      if (lastDigit === 1) return "минута";
      if (lastDigit >= 2 && lastDigit <= 4) return "минуты";
      return "минут";
    }

    function getSecondsWord(seconds: number): string {
      const lastDigit = seconds % 10;
      const lastTwoDigits = seconds % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "секунд";
      if (lastDigit === 1) return "секунда";
      if (lastDigit >= 2 && lastDigit <= 4) return "секунды";
      return "секунд";
    }

    if (Number(lastTicket.createdAt) + 5 * 60 * 1000 > Number(new Date())) {
      const lastTicketMinusFiveMin = Number(lastTicket.createdAt) + 5 * 60 * 1000;
      const newDate = Number(new Date());
      const remainingMs = lastTicketMinusFiveMin - newDate;
      const remainingMinutes = Math.floor(remainingMs / 1000 / 60);
      const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);

      let timeText = "";
      if (remainingMinutes > 0 && remainingSeconds > 0) {
        timeText = `${remainingMinutes} ${getMinutesWord(remainingMinutes)} ${remainingSeconds} ${getSecondsWord(remainingSeconds)}`;
      } else if (remainingMinutes > 0) {
        timeText = `${remainingMinutes} ${getMinutesWord(remainingMinutes)}`;
      } else {
        timeText = `${remainingSeconds} ${getSecondsWord(remainingSeconds)}`;
      }

      throw ApiError.tooManyRequests({
        msg: `Создавать обращение можно раз в 5 минут. Осталось: ${timeText}`,
      });
    }

    try {
      switch (ticketCategory) {
        case "help":
          const ticketHelp = await Ticket.create({
            title: ticketFrom.title,
            description: ticketFrom.description,
            status: "open",
            category: ticketCategory,
            userId: user._id,
            userName: user.name ? user.name : user.login,
            userEmail: user.email,
            messages: [
              {
                text: ticketFrom.description,
                isAdmin: false,
                userName: user.name ? user.name : user.login,
                userAvatar: null,
                createdAt: new Date(),
              },
            ],
          });
          return ticketHelp;
        case "propose":
          const ticketPropose = await Ticket.create({
            title: ticketFrom.title,
            description: ticketFrom.description,
            status: "open",
            category: ticketCategory,
            userId: user._id,
            userName: user.name ? user.name : user.login,
            userEmail: user.email,
            messages: [
              {
                text: ticketFrom.description,
                isAdmin: false,
                userName: user.name ? user.name : user.login,
                userAvatar: null,
                createdAt: new Date(),
              },
            ],
          });
          return ticketPropose;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getTotalTicketsForAdminPanel(): Promise<void> {
    const stats = await Ticket.aggregate([
      {
        $facet: {
          totalTickets: [{ $count: "count" }],
          openedTickets: [{ $match: { status: "open" } }, { $count: "count" }],
          inWorkTickets: [{ $match: { status: "in_progress" } }, { $count: "count" }],
          resolvedTickets: [{ $match: { status: "resolved" } }, { $count: "count" }],
        },
      },
      {
        $project: {
          totalTickets: { $ifNull: [{ $arrayElemAt: ["$totalTickets.count", 0] }, 0] },
          openedTickets: { $ifNull: [{ $arrayElemAt: ["$openedTickets.count", 0] }, 0] },
          inWorkTickets: { $ifNull: [{ $arrayElemAt: ["$inWorkTickets.count", 0] }, 0] },
          resolvedTickets: {
            $ifNull: [{ $arrayElemAt: ["$resolvedTickets.count", 0] }, 0],
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalTickets: 0,
      openedTickets: 0,
      inWorkTickets: 0,
      resolvedTickets: 0,
    };

    return result;
  }
  async getAllTicketsForAdminPanel(
    pagination: Pagination,
    status: string,
    category: string,
    query: string
  ): Promise<ITicket[]> {
    const match: any = {};
    if (status) match.status = status;
    if (category) match.category = category;

    // Поиск с учетом опечаток
    if (query && query.trim()) {
      match.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        { userEmail: { $regex: query, $options: "i" } },
        { _id: query.length === 24 ? OID(query) : null },
      ].filter(Boolean);
    }

    const tickets = await Ticket.find(match)
      .sort({ updatedAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();

    return tickets;
  }

  async sendMessageOrCloseTicket({
    data,
    user,
    ticketId,
    close,
  }: {
    data: any;
    user: IUser;
    ticketId: Types.ObjectId;
    close: boolean;
  }): Promise<ITicket> {
    if (!ticketId) {
      throw ApiError.badRequest({ msg: "Такого тикета не существует", alert: true });
    }

    const checkTicket = await this.getTicketById(ticketId);
    if (String(checkTicket.userId) != String(user._id)) {
      throw ApiError.badRequest({ msg: "Неплохая попытка!", alert: true });
    }
    if (checkTicket.status === "closed" || checkTicket.status === "resolved") {
      throw ApiError.badRequest({ msg: "Неплохая попытка!", alert: true });
    }

    if (close) {
      try {
        const ticket = await Ticket.findByIdAndUpdate(
          ticketId,
          {
            status: "resolved",
            $push: {
              messages: {
                text: "Тема закрыта пользователем",
                isAdmin: true,
                userName: "Сервисное сообщение",
                userAvatar: null,
                createdAt: new Date(),
              },
            },
          },
          { new: true }
        ).lean();
        return ticket;
      } catch (e) {
        console.log(e);
      }
    }

    if (data.message.length < 10 && data.message.length > 5000) {
      throw ApiError.badRequest({
        msg: "Сообщение должно содержать минимум 10 символов и не может превышать 5000 символов",
        alert: true,
      });
    }

    const addMessageToTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          messages: {
            text: data.message,
            isAdmin: false,
            userName: user.name ? user.name : user.login,
            userAvatar: null,
            createdAt: new Date(),
          },
        },
      },
      { new: true } // возвращает обновленный документ
    );

    return addMessageToTicket;
  }

  async adminSendMessageOrSwitchStatus({
    ticketId,
    user,
    status,
    data,
  }: {
    ticketId: Types.ObjectId;
    user: IUser;
    status: string | null;
    data: any;
  }) {
    if (status) {
      const statusMap = {
        open: "Открыто",
        in_progress: "В работе",
        resolved: "Решено",
        closed: "Закрыто",
      };

      const statusText = statusMap[status] || status;

      const ticket = await Ticket.findByIdAndUpdate(
        ticketId,
        {
          status: status,
          $push: {
            messages: {
              text: `Администратор изменил статус вашего обращения. Теперь статус обращения: ${statusText}`,
              isAdmin: true,
              userName: "Сервисное сообщение",
              userAvatar: null,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      ).lean();
      return ticket;
    }
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          messages: {
            text: data.message,
            isAdmin: false,
            userName: user.name ? user.name : user.login,
            userAvatar: null,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );
    return ticket;
  }
}
