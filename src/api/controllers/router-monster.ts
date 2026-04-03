import { UserAgent } from "@types";
import { authRouter } from "./auth";
import { ApiError } from "@api/errors";
import * as useragent from "express-useragent";
import { Actor } from "@api/utils/actor-domain";
import { AppContract } from "@contracts/app.namespace";
import { FastifyInstance, FastifyRequest, RegisterOptions } from "fastify";
import { profileRouter } from "./profile";
import { appLogger } from "@winston-logger";
import { adminUsersHandler } from "./admin/handlers";
import { adminRouter } from "./admin/admin.router";

export const injectAppRoutes = async (
  fastify: FastifyInstance,
  opts?: RegisterOptions
) => {
  fastify.addHook("onRequest", (req, reply, done) => {
    req.actor = Actor.createActor();
    /**
     * Если этот маршрут исключен для проверки
     */
    if (AppContract.NO_CHECK_USERAGENT_ROUTES.has(req.originalUrl)) {
      return done();
    }

    const userAgent: string = req.headers["user-agent"];
    if (!userAgent) {
      throw ApiError.forbidden();
    }

    const parsedUserAgent: UserAgent = useragent.useragent.parse(userAgent) as UserAgent;
    if (parsedUserAgent?.isBot) {
      throw ApiError.forbidden();
    }
    let clientIp;
    if (req.headers["x-real-ip"]) {
      clientIp = req.headers["x-real-ip"];
    } else if (req.headers["x-forwarded-for"]) {
      clientIp = req.headers["x-forwarded-for"];
    } else {
      clientIp = req.socket.remoteAddress;
    }
    req.actor.setUserDevice({
      ip: String(clientIp),
      os: parsedUserAgent.os,
      isBot: parsedUserAgent.isBot,
      isMobile: parsedUserAgent.isMobile,
      isTV: parsedUserAgent.isSmartTV,
      isDesktop: parsedUserAgent.isDesktop,
      browser: parsedUserAgent.browser,
      version: parsedUserAgent.version,
      platform: parsedUserAgent.platform,
    });
    done();
  });

  fastify.addHook(
    "onRequest",
    (
      req: FastifyRequest & {
        query: {
          limit?: number;
          skip?: number;
        };
      },
      reply,
      done
    ) => {
      req.pagination = {
        limit: req.query.limit ? req.query.limit : 100,
        skip: req.query?.skip,
      };
      done();
    }
  );
  fastify.addHook("onSend", (req, reply, payload, done) => {
    if (reply.request.method != "OPTIONS") {
      appLogger.info(
        `${reply.request.method} ${reply.request.originalUrl} ${reply.statusCode} -> ${reply.elapsedTime.toFixed()} ms`
      );
    }

    done();
  });

  await fastify.register(authRouter, opts);
  await fastify.register(adminRouter, opts);
  await fastify.register(profileRouter, opts);
};
