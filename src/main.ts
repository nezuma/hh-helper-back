import fs from "fs";
import "dotenv/config";
import path from "path";
import mongoose from "mongoose";
import { IConfig } from "@types";
import { InjectionMode } from "awilix";
import { appConfigSchema } from "@config";
import { appLogger } from "@winston-logger";
import { SwaggerContract } from "@contracts";
import { apiErrorHandler } from "@api/errors";
import Fastify, { FastifyInstance } from "fastify";
import { enableServiceInjection } from "@di-container";

import { fastifyEnv } from "@fastify/env";
import { fastifyCors } from "@fastify/cors";
import { fastifyCookie } from "@fastify/cookie";
import fastifyFormbody from "@fastify/formbody";
import { fastifySwagger } from "@fastify/swagger";
import { injectAppRoutes } from "@api/controllers";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

const app: FastifyInstance = Fastify({
  disableRequestLogging: true,
});

const appConfig = process.env as Partial<IConfig>;

export async function bootstrapApp() {
  if (!appConfig.SIGNATURE_SECRET) {
    appLogger.fatal("Нет поля SIGNATURE_SECRET");
    process.exit(0);
  }
  if (!appConfig.SERVICE_MODE) {
    appLogger.fatal("Нет поля SERVICE_MODE");
    process.exit(0);
  }

  await app.register(fastifyEnv, {
    schema: appConfigSchema,
    dotenv: true,
  });

  app.setErrorHandler(apiErrorHandler);

  await app.register(fastifyCookie);

  await app.register(fastifyCors, {
    methods: ["PATCH", "GET"],
    origin: true,
    credentials: true,
  });
  await app.register(fastifyFormbody);

  await app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true,
    injectionMode: InjectionMode.CLASSIC,
  });

  await enableServiceInjection();

  await app.register(fastifySwagger, SwaggerContract.Config);
  await app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    theme: {
      css: [
        {
          filename: "main.css",
          content: fs.readFileSync(path.join(__dirname, "/assets", "/main.css"), "utf8"),
        },
      ],
    },
  });

  app.addHook("onResponse", (req, reply) => {
    req.log.info(`${req.method} ${req.originalUrl} -> ${reply.elapsedTime.toFixed()} ms`);
  });

  await injectAppRoutes(app);

  if (appConfig?.NODE_ENV === "dev") {
    console.log(app.printRoutes());
  }

  try {
    await mongoose.connect(appConfig.DATABASE_URL);
    appLogger.verbose("DataBase MONGODB successful connected.");
  } catch (err) {
    appLogger.fatal("DataBase MONGODB lost connection");
    console.error(err);
  }

  try {
    await app.listen({ port: appConfig.PORT });
    appLogger.verbose(
      `Server started at: http://${appConfig.HOSTNAME}:${appConfig.PORT}`
    );
    // console.log(app.printRoutes(printOptions));
  } catch (err) {
    appLogger.fatal("Server lost connection");
    console.error(err);
  }
}
bootstrapApp();

export { app, appConfig };
