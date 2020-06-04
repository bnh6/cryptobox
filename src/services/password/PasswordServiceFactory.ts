import { PasswordService } from "./PasswordService";
import { PasswordServiceOSX } from "./PasswordServiceOSX";
import { PasswordServiceLinux } from "./PasswordServiceLinux";
import * as os from "os";

export class PasswordServiceFactory {
  public static create(): PasswordService {
    const services: any = {
      darwin: PasswordServiceOSX,
      linux: PasswordServiceLinux,
    };

    const platform: string = os.platform();

    if (!(platform in services)) {
      throw new Error(`The platform ${platform} is not currently supported.`);
    }
    return new services[platform]();
  }
}
