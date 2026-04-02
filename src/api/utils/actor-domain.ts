import { di } from "@config";
import { OID } from "@api/helpers";
import { ApiError } from "@api/errors";
import {
  IUser,
  AuthService,
  UserService,
  CryptoService,
  IUserDevice,
  AuthLogService,
} from "@api/services";

export class Actor {
  private user: IUser;
  private userDevice: IUserDevice;

  private constructor() {}

  static createActor(): Actor {
    const createActor = new Actor();
    return createActor;
  }

  get getUser(): Readonly<IUser> {
    return this.user;
  }

  get getUserDevice(): Readonly<IUserDevice> {
    return this.userDevice;
  }

  setUser(updatedUser: IUser): void {
    this.user = updatedUser;
  }

  setUserDevice(userDevice: Omit<IUserDevice, "userId" | "token">): void {
    this.userDevice = {
      ...this.userDevice,
      ...userDevice,
    };
  }

  async tryAuth(accessToken: string | undefined, refreshToken: string): Promise<string> {
    const authService = di.container.resolve<AuthService>("authService");
    const userService = di.container.resolve<UserService>("userService");
    const cryptoService = di.container.resolve<CryptoService>("cryptoService");
    const authHistoryService = di.container.resolve<AuthLogService>("authLogService");

    let decodedData: { id: string };
    if (!accessToken) {
      decodedData = cryptoService.decodeJwtSignature(refreshToken);
    } else {
      decodedData = cryptoService.decodeJwtSignature(accessToken);
    }
    const userId = OID(decodedData.id);
    const foundUser = await userService.getUser(userId, null);
    const session = await authHistoryService.findAuthLogByUserId(userId);

    if (!session) {
      throw ApiError.unAuth({ alert: true });
    }
    let newAccessToken: string;

    if (!authService.verifyAccessToken(accessToken)) {
      const verifyRefresh = authService.verifyRefreshToken(refreshToken);
      if (!verifyRefresh) {
        throw ApiError.unAuth({ alert: true });
      }
      newAccessToken = cryptoService.generateAccessToken(foundUser._id);
    }

    this.setUser({
      _id: foundUser._id,
      ...foundUser,
      lastVisitAt: new Date(),
      accessToken: newAccessToken ? newAccessToken : accessToken,
      refreshToken: refreshToken,
    });

    // console.log("User after set:", this.user);

    return newAccessToken;
  }
}
