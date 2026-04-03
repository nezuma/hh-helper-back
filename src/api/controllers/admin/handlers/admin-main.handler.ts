import { di } from "@config";
import { AdminService } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";

export const adminMainHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const adminService = di.container.resolve<AdminService>("adminService");

  const counts = await adminService.getMainAdminStats();

  return reply.status(200).send(counts);
};
