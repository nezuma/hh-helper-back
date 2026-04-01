import { TariffKeys } from "@api/models";
import { Types } from "mongoose";

export interface ITariff {
  _id: Types.ObjectId;
  name: string;
  duration: Date | null;
  key: TariffKeys;
  price: number;
  popular: boolean;
  features: {
    choose_response: boolean;
    main_page: boolean;
    activate_bot: boolean;
    autoresponse: boolean;
    autoboost_vacancy: boolean;
    priority_help: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
