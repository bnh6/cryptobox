import { ServiceError, ErrorType } from "../ServiceError";
import { Volume } from "../../entities/Volume";
import { constants } from "../../utils/constants";
import log from "../LogService";
import * as keytar from "keytar";
import PasswordServiceInterface from "./PasswordServiceInterface";

/**
 * Password management class is composed by Asynchronous methods that are responsible for
 * store, update, delete and search for passwords using the native secrets management service.
 * It is havely based on https://github.com/atom/node-keytar
 * 
 * keytar information mapping
 *  service -> volume alias
 *  account -> constant (PASSWORD MANAGER ALIAS) 
 * 
 */



import { exec } from "child_process";
// import * as keytar from "keytar-pass";



export default class PasswordService implements PasswordServiceInterface {
    constructor() {
        if (process.platform != "win32" && process.platform != "darwin") {
            log.info(`Detected current OS: ${process.platform}.  Initializing pass library for password storage.`);
            exec("pass", (err, stdout, stderr) => {
                if (stdout.startsWith("Password Store")) {
                    log.info("Pass library already initialized.");
                } else if (stdout.includes("Error: password store is empty. Try \"pass init\".")) {
                    // initialize pass
                    exec(`cat >keygenInfo <<EOF
                    %echo Generating a basic OpenPGP key
                    %no-protection
                    Key-Type: DSA
                    Key-Length: 1024
                    Subkey-Type: ELG-E
                    Subkey-Length: 1024
                    Name-Real: YOUR NAME HERE
                    Name-Comment: Coolness 123
                    Name-Email: you@domain.com
                    Expire-Date: 0
                    # Do a commit here, so that we can later print "done" :-)
                    %commit
                    %echo done
                EOF`);
                    exec("gpg --batch --generate-key keygenInfo");
                    exec("pass init you@domain.com", (error, stdout, stderr) => {
                        if (error) {
                            log.error(`Error initializing pass: ${error.message}`);
                        }
                        if (stderr) {
                            log.error(`Error output (stderr) while initializing pass: ${stderr}`);
                        }
                        log.info(`pass init: output: ${stdout}`);
                    });

                } else if (stdout.includes("No such file or directory")) {
                    log.error("Using a linux system, but the pass library does not appear to be installed. \
                    Try running \"sudo apt install pass\".");
                }
            });
        }
    }



    /**
     * if succeed return void, if failed throws PasswordError
     * @param password represents the password value 
     * @param volume uses the volume alias as password reference
     */
    async savePassword(password: string, volume: Volume) {
        try {
            const encodedPassword = Buffer.from(password, "ascii").toString("base64");

            await keytar.setPassword(
                volume.getVolumeAlias(),
                constants.PASSWORD_MANAGER_ACCOUNT,
                encodedPassword);

            // log.debug(`password saved for ${volume.getVolumeAlias()}`);

        } catch (error) {
            log.error(`error to save password, ${error}`);
            throw new ServiceError(ErrorType.ErrorSavingPassword);
        }
    }


    /**
     * if succeed return void, if failed throws PasswordError
     * @param volume it will the volume alias to reference the password to be deleted.
     */
    async deletePassword(volume: Volume) {
        try {
            await keytar.deletePassword(
                volume.getVolumeAlias(),
                constants.PASSWORD_MANAGER_ACCOUNT
            );
            // log.debug(`password deleted for ${volume.getVolumeAlias()}`);
        } catch (error) {
            log.error(`error to delete password, ${error}`);
            throw new ServiceError(ErrorType.ErrorDeletingPassword);
        }
    }


    /**
     * if password not found returns null.
     * If found, return the cleartext password
     * if failed to search, returns PasswordError
     * @param volume uses the volume alias as password reference
     */
    public async searchForPassword(volume: Volume): Promise<string> {
        const encodedPassword = await keytar.getPassword(
            volume.getVolumeAlias(),
            constants.PASSWORD_MANAGER_ACCOUNT);

        try {
            if (encodedPassword == null)
                return null; //password not found
            else {
                const decodedPassword = Buffer.from(encodedPassword, "base64").toString("ascii");
                return decodedPassword;
            }
        } catch (error) {
            log.error(`unknown error when searching password ->${error}`);
            throw new ServiceError(ErrorType.ErrorSearchingPassword);
        }
    }

    async passwordExist(volume: Volume): Promise<boolean> {
        try {
            const pass = await this.searchForPassword(volume);
            if (pass != null)
                return true;
            else
                return false;

        } catch (error) {
            const msg = `unknown error when searching if password exists ->${error}`;
            throw error;
        }
    }
}
