import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import { PasswordServiceBase } from "./PasswordServiceBase";
import { PasswordService } from "./PasswordService";
import { constants } from "../../utils/constants";
import log from "../../utils/LogUtil";
import * as ShellHelper from "../../utils/ShellUtil";

export class PasswordServiceOSX extends PasswordServiceBase
  implements PasswordService {
  retrievePasswordCommand(volume: Volume): string {
    return `security find-generic-password  -a "${
      constants.PASSWORD_MANAGER_ALIAS
    }" -s "${volume.getVolumeAlias()}" -w `;
    // return "cat /tmp/cryptobox/pass.txt";
  }

  searchForPassword(volume: Volume): Password | null {
    log.info(`searching password for ${volume}`);

    let command = this.retrievePasswordCommand(volume);

    let [result, stdout, stderr] = ShellHelper.execute(command, [], false);

    const passwordDecoded = Buffer.from(stdout, "base64").toString("ascii");

    if (result === 0) return new Password(passwordDecoded);
    if (result === 44)
      // not found
      return null;
    if (result === 0) {
      log.error("unknown error when searching password");
      return null;
      // throw new Error(stderr)
    }
  }

  saveNewPassword(password: Password, volume: Volume): void {
    log.info(`saving password for ${password.passwordManagerRef}`);

    let comment = "Created by cryptobox @ $( date +'%Y.%m.%d-%H:%M')";

    const encodedPassword = Buffer.from(password.passwordValue, "ascii").toString("base64");

    let command = `security add-generic-password -a '${
      constants.PASSWORD_MANAGER_ALIAS
    }' -s '${volume.getVolumeAlias()}' -D 'application password' -j "${comment}" -w'${
      encodedPassword
    }' -U`;
    let result = ShellHelper.execute(command);
  }

  deletePassword(volume: Volume): void {
    const command = `security delete-generic-password -a "${
      constants.PASSWORD_MANAGER_ALIAS
    }" -s '${volume.getVolumeAlias()}'`;
    ShellHelper.execute(command, []);
  }
}
