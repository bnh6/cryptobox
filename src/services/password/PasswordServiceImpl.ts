import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import { PasswordServiceBase } from "./PasswordServiceBase";
import { PasswordService } from "./PasswordService";
import PasswordServiceError from "./PasswordError";
import { constants } from "../../utils/constants";
import log from "../../utils/LogUtil";
import * as keytar from "keytar";


export class PasswordServiceImpl extends PasswordServiceBase
    implements PasswordService {

    // service volume
    // account const

    savePassword(password: string, volume: string): void {
        const encodedPassword = Buffer.from(password, "ascii").toString("base64");
        keytar.setPassword(
            volume,
            constants.PASSWORD_MANAGER_ACCOUNT,
            encodedPassword
        ).then(response => { return; }).catch(error => {
            const msg = `error to save password, ${error}`;
            log.error(msg);
            throw new PasswordServiceError(msg);
        });
    }
    deletePassword(volume: string): void {
        keytar.deletePassword(
            volume,
            constants.PASSWORD_MANAGER_ACCOUNT
        ).then(response => { return; }).catch(error => {
            const msg = `error to delete password, ${error}`;
            log.error(msg);
            throw new PasswordServiceError(msg);
        });
    }

    searchForPassword(volume: string): string {
        const password = keytar.getPassword(
            volume,
            constants.PASSWORD_MANAGER_ACCOUNT);
        password.then((clearTextPassword) => {
            try {
                if (clearTextPassword == null)
                    return null;
                else {
                    const decodedPassword = Buffer.from(clearTextPassword, "base64").toString("ascii");
                    log.debug("password found and decoded ...");
                    return decodedPassword;
                }
            } catch (error) {
                const msg = `unknown error when searching password ->${error}`;
                log.error(msg);
                throw new PasswordServiceError(msg);
            }
        }).catch(error => {
            const msg = `error to search password, ${error}`;
            log.error(msg);
            throw new PasswordServiceError(msg);
        });
        log.error("should not get to this point, there is an async call issue with the passwordservice.searchForPassword");
        return null;
    }

    searchForCredentials(): string[] {
        throw new Error("Method not implemented.");
    }
    // retrievePasswordCommand(volume: Volume): string {
    //   return `security find-generic-password  -a "${constants.PASSWORD_MANAGER_ALIAS
    //     }" -s "${volume.getVolumeAlias()}" -w `;
    //   // return "cat /tmp/cryptobox/pass.txt";
    // }

    // searchForPassword(volume: Volume): Password | null {
    //   log.info(`searching password for ${volume}`);

    //   let command = this.retrievePasswordCommand(volume);

    //   let [result, stdout, stderr] = ShellHelper.execute(command, [], false);

    //   const passwordDecoded = Buffer.from(stdout, "base64").toString("ascii");

    //   if (result === 0) return new Password(passwordDecoded);
    //   if (result === 44)
    //     // not found
    //     return null;
    //   if (result === 0) {
    //     log.error("unknown error when searching password");
    //     return null;
    //     // throw new Error(stderr)
    //   }
    // }

    // saveNewPassword(password: Password, volume: Volume): void {
    //   log.info(`saving password for ${password.passwordManagerRef}`);

    //   let comment = "Created by cryptobox @ $( date +'%Y.%m.%d-%H:%M')";

    //   const encodedPassword = Buffer.from(password.passwordValue, "ascii").toString("base64");

    //   let command = `security add-generic-password -a '${constants.PASSWORD_MANAGER_ALIAS
    //     }' -s '${volume.getVolumeAlias()}' -D 'application password' -j "${comment}" -w'${encodedPassword
    //     }' -U`;
    //   let result = ShellHelper.execute(command);
    // }

    // deletePassword(volume: Volume): void {
    //   const command = `security delete-generic-password -a "${constants.PASSWORD_MANAGER_ALIAS
    //     }" -s '${volume.getVolumeAlias()}'`;
    //   ShellHelper.execute(command, []);
    // }
}
