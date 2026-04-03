import { TariffService, UserService } from "@api/services";
import { di } from "@config";
import { FastifyReply, FastifyRequest } from "fastify";

export const profileSettingsHandler = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const userService = di.container.resolve<UserService>("userService");

  const settingType = req.query["settingType"];

  switch (settingType) {
    case "changePassword":
      const { oldPassword, newPassword, confirmNewPassword } = req.body as {
        oldPassword: string;
        newPassword: string;
        confirmNewPassword: string;
      };
      console.log({ oldPassword, newPassword, confirmNewPassword });
      await userService.changeUserPassword({
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
        userId: req.actor.getUser._id,
      });
    case "changeName":
      const { newName } = req.body as { newName: string };
      await userService.changeUserName(newName, req.actor.getUser._id);
  }

  return reply.status(200).send({
    msg:
      settingType === "changePassword"
        ? "Успешная смена пароля!"
        : "Успешная смена имени!",
    alert: true,
    changePassword: settingType === "changePassword" ? true : false,
  });
};
