import { Types } from "mongoose";
import { ApiError } from "@api/errors";

export const OID = (id: string): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest({ msg: "1-01 Invalid ObjectId string" });
  }
  return new Types.ObjectId(id);
};
