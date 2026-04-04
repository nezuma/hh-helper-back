import { Types } from "mongoose";

export type NotificationType = "user" | "all";

export interface INotification {
  title: string;
  content: string;
  type: NotificationType;
  link?: string;
  userId?: Types.ObjectId | null;
  isRead: boolean;
  readBy?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
