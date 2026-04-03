import { di } from "@config";
import { UserService } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";

export const adminUsersHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const userService = di.container.resolve<UserService>("userService");

  const users = await userService.getAllUsers(req.pagination);

  return reply.status(200).send(users);
};
