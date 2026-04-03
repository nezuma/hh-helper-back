import { di } from "@config";
import { UserService } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";

export const profileHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const userService = di.container.resolve<UserService>("userService");
  const userId = req.actor.getUser._id;

  const user = await userService.getUserById(userId, false);

  return reply.send(user).status(200);
};
