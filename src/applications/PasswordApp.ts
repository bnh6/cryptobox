import { Password } from "../entities/Password";
import { Volume } from "../entities/Volume";
import { PasswordService } from "../services/password/PasswordService";
import log from "../utils/LogUtil";

export class PasswordApplication {
    passwordService: PasswordService;
    constructor() {
        this.passwordService = new PasswordService();
    }

    passwordExists(sourceVol: Volume): boolean {
        let password = this.passwordService.searchForPassword(sourceVol);

        if (password) {
            log.info(" password found *******");
            return true;
        } else {
            log.info("password not found, prompting one");
            return false;
        }
    }

    async findPassword(volume: Volume): Promise<Password> {
        return new Password(await this.passwordService.searchForPassword(volume));
    }

    savePassword(password: Password, volume: Volume): void {
        this.passwordService.savePassword(password.passwordValue, volume);
    }
}
