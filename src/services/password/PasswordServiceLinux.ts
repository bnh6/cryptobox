import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import { PasswordServiceBase } from "./PasswordServiceBase";
import { PasswordService } from "./PasswordService";
import log from "../../utils/LogUtil";
import * as ShellHelper from "../../utils/ShellUtil";

export class PasswordServiceLinux extends PasswordServiceBase
  implements PasswordService {
  //  TODO implement a proper password manager
  passwordWorkAround = "/tmp/cryptobox/pass.txt";

  retrievePasswordCommand(volume: Volume): string {
    return `cat ${this.passwordWorkAround}`;
  }

  searchForPassword(volume: Volume): Password | null {
    log.info(`searching password for ${volume}`);
    let [result, stdout, stderr] = ShellHelper.execute(
      this.retrievePasswordCommand(volume)
    );
    return new Password(String(stdout));
  }

  saveNewPassword(password: Password): void {
    log.info(`saving password for ${password.passwordManagerRef}`);
    const command = `echo '${password.passwordValue}' > ${this.passwordWorkAround}`;
    ShellHelper.execute(command);
  }

  deletePassword(volume: Volume): void {
    ShellHelper.execute(`rm -rf ${this.passwordWorkAround}`);
  }
}
