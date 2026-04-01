export const appConfigSchema = {
  type: "object",
  required: [
    "PORT",
    "API_URL",
    "HOSTNAME",
    "CLIENT_URL",
    "SERVICE_MODE",
    "DATABASE_URL",
    "SESSION_SECRET",
    "SIGNATURE_SECRET",
  ],
  properties: {
    PORT: {
      type: "number",
    },
    API_URL: {
      type: "string",
    },
    DATABASE_URL: {
      type: "string",
    },
    LOGGER_URL: {
      type: "string",
    },
    LOGGER_TAG: {
      type: "string",
    },
    SIGNATURE_SECRET: {
      type: "string",
    },
    HOSTNAME: {
      type: "string",
    },
    SERVICE_MODE: {
      type: "string",
    },
    SESSION_SECRET: {
      type: "string",
    },
  },
};
