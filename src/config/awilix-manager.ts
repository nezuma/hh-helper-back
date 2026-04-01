import { AwilixManager } from "awilix-manager";
import { AwilixContainer, createContainer, InjectionMode } from "awilix";

class Di {
  static instance: Di;

  public container: AwilixContainer;
  public awilixManager: AwilixManager;

  private constructor() {
    this.container = createContainer({
      injectionMode: InjectionMode.CLASSIC,
    });

    this.awilixManager = new AwilixManager({
      diContainer: this.container,
      asyncInit: true,
      strictBooleanEnforced: true,
    });
  }

  static getInstance() {
    if (!Di.instance) {
      Di.instance = new Di();
    }
    return Di.instance;
  }
}

export const di = Di.getInstance();
