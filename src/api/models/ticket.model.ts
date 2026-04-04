import mongoose from "mongoose";
import { ITicket } from "@api/services";

// Схема для сообщения
const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Текст сообщения обязателен"],
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    userName: {
      type: String,
      required: [true, "Имя пользователя обязательно"],
      trim: true,
    },
    userAvatar: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Схема для обращения (тикета)
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Заголовок обращения обязателен"],
      trim: true,
      minlength: [3, "Заголовок должен содержать минимум 3 символа"],
      maxlength: [200, "Заголовок не может превышать 200 символов"],
    },
    description: {
      type: String,
      required: [true, "Описание обращения обязательно"],
      trim: true,
      minlength: [10, "Описание должно содержать минимум 10 символов"],
      maxlength: [5000, "Описание не может превышать 5000 символов"],
    },
    status: {
      type: String,
      enum: {
        values: ["open", "in_progress", "resolved", "closed"],
        message: "Статус должен быть одним из: open, in_progress, resolved, closed",
      },
      default: "open",
    },
    category: {
      type: String,
      enum: {
        values: ["help", "propose", "other"],
        message: "Категория должна быть одной из: help, propose, other",
      },
      required: [true, "Категория обращения обязательна"],
      default: "help",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ID пользователя обязателен"],
    },
    userName: {
      type: String,
      required: [true, "Имя пользователя обязательно"],
      trim: true,
    },
    userEmail: {
      type: String,
      required: [true, "Email пользователя обязателен"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Пожалуйста, введите корректный email"],
    },
    messages: [messageSchema],
  },
  {
    timestamps: true, // Автоматически создаст createdAt и updatedAt
    versionKey: false,
  }
);

// Индексы для быстрого поиска
// ticketSchema.index({ userId: 1, status: 1, createdAt: -1 });
ticketSchema.index({ userEmail: 1 });
ticketSchema.index({ status: 1, category: 1 });
ticketSchema.index({ createdAt: -1 });

// Создание модели
export const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);
