import { FastifyReply, FastifyRequest } from "fastify";

export const registerAcceptHandler = async (req: FastifyRequest, reply: FastifyReply) => {
  console.log(req.query);
};
