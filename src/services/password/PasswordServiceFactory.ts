import { PasswordService } from "./PasswordService";
import { PasswordServiceImpl } from "./PasswordServiceImpl";
import * as os from "os";

export class PasswordServiceFactory {
    public static create(): PasswordService {
        const services: any = {
            darwin: PasswordServiceImpl,
            linux: PasswordServiceImpl,
        };

        const platform: string = os.platform();

        if (!(platform in services)) {
            throw new Error(`The platform ${platform} is not currently supported.`);
        }
        return new services[platform]();
    }
}
