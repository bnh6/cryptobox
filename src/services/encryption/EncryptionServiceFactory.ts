import { EncryptionService } from "./EncryptionService";
import { EncryptionServiceOSX } from "./EncryptionServiceOSX";
import { EncryptionServiceLinux } from "./EncryptionServiceLinux";
import * as os from "os";

export class EncryptionServiceFactory {
  public static create(): EncryptionService {
    const services: any = {
      darwin: EncryptionServiceOSX,
      linux: EncryptionServiceLinux
    };

    const platform: string = os.platform();

    if (!(platform in services)) {
      throw new Error(`The platform ${platform} is not currently supported.`);
    }
    return new services[platform]();
  }
}
