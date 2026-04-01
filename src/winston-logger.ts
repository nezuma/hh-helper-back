import { locale } from "moment";
import { appConfig } from "@main";
import LokiTransport = require("winston-loki");
import { createLogger, format, Logger, transports } from "winston";
locale("ru");

export const commonFormat = format.combine(
  format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  format.colorize({ all: true }),
  format.printf((info) => `⏱️  [${info.timestamp}] ${info.message}`)
);

export class AppLogger {
  private logger: Logger;

  /**
   * Реализуем Singleton
   */
  private constructor() {
    const lokiHost = appConfig?.LOGGER_URL ?? "http://127.0.0.1:3100";
    const lokiTag = appConfig?.LOGGER_TAG ?? "api";

    this.logger = createLogger({
      transports: [
        new LokiTransport({
          level: "verbose",
          host: lokiHost,
          labels: {
            job: lokiTag,
          },
          format: commonFormat,
        }),
        new transports.Console({
          level: "verbose",
          format: commonFormat,
        }),
      ],
    });
  }

  static instance: AppLogger;

  static getInstance(): AppLogger {
    if (!AppLogger.instance) {
      AppLogger.instance = AppLogger.createLogger();
    }
    return AppLogger.instance;
  }

  static createLogger(): AppLogger {
    return new AppLogger();
  }

  info(message: string) {
    this.logger.info(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }

  fatal(message: string) {
    this.logger.error(`FATAL: ` + message);
  }

  error(message: string) {
    this.logger.error(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}

export const appLogger = AppLogger.getInstance();
