import { appConfig } from "@main";
import { AppCookieOptions } from "@types";

export namespace AppContract {
  export const NO_CHECK_USERAGENT_ROUTES = new Set([
    // "/payment/tinkoff-notification",
    // "/payment/payselection-notification",
  ]);

  export const SWAGGER_PATH = "/docs";

  export const GET_COOKIE_OPTIONS = (): AppCookieOptions => {
    const isLocalhost = appConfig.HOSTNAME === "localhost";
    return {
      path: "/",
      priority: "high",
      domain: appConfig.HOSTNAME,
      partitioned: true,
      maxAge: 31536000000,
      secure: !isLocalhost,
      sameSite: isLocalhost ? "lax" : "none",
    };
  };
}
