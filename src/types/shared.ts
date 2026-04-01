import { Actor } from "@api/utils/actor-domain";
import { SerializeOptions } from "@fastify/cookie";
import { FastifyReply, FastifyRequest } from "fastify";

export type ApiErrorProps = Partial<{
  alert?: boolean;
  msg?: string;
}>;

export type UserAgent = {
  isYaBrowser: boolean;
  isAuthoritative: boolean;
  isMobile: boolean;
  isMobileNative: boolean;
  isTablet: boolean;
  isiPad: boolean;
  isiPod: boolean;
  isiPhone: boolean;
  isiPhoneNative: boolean;
  isAndroid: boolean;
  isAndroidNative: boolean;
  isBlackberry: boolean;
  isOpera: boolean;
  isIE: boolean;
  isEdge: boolean;
  isIECompatibilityMode: boolean;
  isSafari: boolean;
  isFirefox: boolean;
  isWebkit: boolean;
  isChrome: boolean;
  isKonqueror: boolean;
  isOmniWeb: boolean;
  isSeaMonkey: boolean;
  isFlock: boolean;
  isAmaya: boolean;
  isPhantomJS: boolean;
  isEpiphany: boolean;
  isDesktop: boolean;
  isWindows: boolean;
  isLinux: boolean;
  isLinux64: boolean;
  isMac: boolean;
  isChromeOS: boolean;
  isBada: boolean;
  isSamsung: boolean;
  isRaspberry: boolean;
  isBot: boolean;
  isCurl: boolean;
  isAndroidTablet: boolean;
  isWinJs: boolean;
  isKindleFire: boolean;
  isSilk: boolean;
  isCaptive: boolean;
  isSmartTV: boolean;
  isUC: boolean;
  isFacebook: boolean;
  isAlamoFire: boolean;
  isElectron: boolean;
  silkAccelerated: boolean;
  browser: string;
  version: string;
  os: string;
  platform: string;
  geoIp: object;
  source: string;
  isWechat: false;
  electronVersion: string;
};

export type FastifyMiddleware = (
  req: FastifyRequest,
  reply: FastifyReply,
  done?: Function
) => Promise<void> | void;

export type Pagination = {
  skip: number;
  limit: number;
};

export type PaginatedResponse<PaginatedItem> = {
  totalSize: number;
  items: PaginatedItem[];
};

export type AppCookieOptions = SerializeOptions;

declare module "fastify" {
  interface FastifyRequest {
    actor: Actor;
    pagination: {
      skip: number;
      limit: number;
    };
  }
}
