import { di } from "@config";
import { AdminService } from "@api/services";
import { FastifyReply, FastifyRequest } from "fastify";

export const adminAnalyticsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  const adminService = di.container.resolve<AdminService>("adminService");

  const analytics = await adminService.getAnalytics();

  return reply.status(200).send(analytics);
};
