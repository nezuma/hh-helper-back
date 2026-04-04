import { Types } from "mongoose";

// Интерфейс сообщения
export interface IMessage {
  text: string;
  isAdmin: boolean;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
}

// Интерфейс тикета
export interface ITicket {
  _id: Types.ObjectId;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  category: "help" | "propose" | "other";
  userId: Types.ObjectId;
  userName: string;
  userEmail: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс для создания тикета
export interface ICreateTicket {
  title: string;
  description: string;
  userId?: Types.ObjectId;
  userName?: string;
  userEmail?: string;
  messages?: IMessage[];
}

// Интерфейс для обновления тикета
export interface IUpdateTicket {
  title?: string;
  description?: string;
  status?: "open" | "in_progress" | "resolved" | "closed";
  category?: "help" | "propose" | "other";
}

// Интерфейс для добавления сообщения
export interface IAddMessage {
  text: string;
  isAdmin: boolean;
  userName: string;
  userAvatar?: string;
}
