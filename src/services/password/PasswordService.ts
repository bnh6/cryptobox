import PasswordServiceError from "./PasswordError";
import { Volume } from "../../entities/Volume";
import { constants } from "../../utils/constants";
import log from "../../utils/LogUtil";
import * as keytar from "keytar";


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
export class PasswordService {


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

            log.debug(`password saved for ${volume.getVolumeAlias()}`);

        } catch (error) {
            const msg = `error to save password, ${error}`;
            log.error(msg);
            throw new PasswordServiceError(msg);
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
            log.debug(`password deleted for ${volume.getVolumeAlias()}`);
        } catch (error) {
            const msg = `error to delete password, ${error}`;
            log.error(msg);
            throw new PasswordServiceError(msg);
        }
    }


    /**
     * if password not found returns null.
     * If found, return the cleartext password
     * if failed to search, returns PasswordError
     * @param volume uses the volume alias as password reference
     */
    async searchForPassword(volume: Volume): Promise<string> {
        const encodedPassword = await keytar.getPassword(
            volume.getVolumeAlias(),
            constants.PASSWORD_MANAGER_ACCOUNT);

        try {
            if (encodedPassword == null)
                return null; //password not found
            else {
                const decodedPassword = Buffer.from(encodedPassword, "base64").toString("ascii");
                log.debug("password found and decoded ...");
                return decodedPassword;
            }
        } catch (error) {
            const msg = `unknown error when searching password ->${error}`;
            // log.error(msg);
            throw new PasswordServiceError(msg);
        }
    }

}
