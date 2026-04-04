import mongoose from "mongoose";
import { Types } from "mongoose";
import { INotification } from "@api/services";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Название уведомления обязательно"],
      trim: true,
      maxlength: [200, "Название не может превышать 200 символов"],
    },
    content: {
      type: String,
      required: [true, "Содержимое уведомления обязательно"],
      trim: true,
      maxlength: [1000, "Содержимое не может превышать 1000 символов"],
    },
    type: {
      type: String,
      enum: {
        values: ["user", "all"],
        message: "Тип должен быть user или all",
      },
      required: true,
      default: "all",
    },
    link: {
      type: String,
      trim: true,
      default: null,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Индексы для быстрого поиска
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
