import { Password } from "../entities/Password";
import { Volume } from "../entities/Volume";
import { PasswordService } from "../services/password/PasswordService";
import { PasswordServiceFactory } from "../services/password/PasswordServiceFactory";
import log from "../utils/LogUtil";

export class PasswordApplication {
  passwordService: PasswordService;
  constructor() {
    this.passwordService = PasswordServiceFactory.create();
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

  findPassword(volume: Volume): Password {
    return this.passwordService.searchForPassword(volume);
  }

  savePassword(password: Password, volume: Volume): void {
    this.passwordService.savePassword(password, volume);
  }
}
