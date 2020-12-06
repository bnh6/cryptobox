import { Volume } from "../../entities/Volume";
import log from "../../utils/LogUtil";
import * as shell from "../../utils/ShellUtil";
import * as fs from "fs";
import VolumeServiceInterface from "./VolumeServiceInterface";
import{ ServiceError, ErrorType }  from "../ServiceError";

export default class VolumeService implements VolumeServiceInterface {

    /**
     * check if mounted,
     *      if not mounted -> mount
     *      if already mounted, do nothing
     * @param volume the paths and parameters used to mount the volume
     * @param password 
     */
    public async mount(volume: Volume, password: string, unmountIdle: number = 0): Promise<void> {
        try {
            const alreadyMonted = await this.isMounted(volume);
            if (alreadyMonted) {
                log.debug(`volume ${volume.encryptedFolderPath} already mounted, no need to mount again.`);
                return;
            }
            let command =
                "export CRYFS_FRONTEND=noninteractive; " +
                `echo ${password} | cryfs "${volume.encryptedFolderPath}" "${volume.decryptedFolderPath}"`;

            if (unmountIdle > 0)
                command = command + ` --unmount-idle ${unmountIdle}`;

            const [code, stdout, stderr] = await shell.execute(command, [], false, 25000);

            if (code === 0) return;
            else {
                const error = ServiceError.errorFromCryFS(code);
                log.error(`Error ${error} to UNmount volume, code=${code} stdout=${stdout}, stderr=${stderr}`);
                throw error;
            }
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            log.error(`Error to mount the ${volume.encryptedFolderPath}" -> "${volume.decryptedFolderPath}", ${error}`);
            throw new ServiceError(ErrorType.UnexpectedError);
        }

    }
    public async unmount(volume: Volume) {
        try {
            const alreadyMonted = await this.isMounted(volume);
            if (!alreadyMonted) {
                log.debug(`volume ${volume.encryptedFolderPath} already UNmounted...`);
                return;
            }
            const command = `cryfs-unmount "${volume.decryptedFolderPath}" `; // cryfs expected the decrypted fodler.
            const [code, stdout, stderr] = await shell.execute(command, [], false, 7000);

            if (code === 0) return;
            else {
                const error = ServiceError.errorFromCryFS(code);
                const msg = `Error ${error} to UNmount volume, stdout=${stdout}, stderr=${stderr}`;
                throw error;
            }
        } catch (error) {
            if (error instanceof ServiceError) throw error;
            log.error(`Error to UNmount the volume ${volume.encryptedFolderPath}, ${error}`);
            throw new ServiceError(ErrorType.UnexpectedError);
        }
    }

    public async isMounted(volume: Volume): Promise<boolean> {
        try {
            const command = `mount | grep -qs '${volume.encryptedFolderPath}'`;

            const [code, stdout, stderr] = await shell.execute(command, [], false, 7000);

            if (code === 0) return true;
            if (code === 1) return false;


            const error = ServiceError.errorFromCryFS(code);
            const msg = `Error ${error} to check whether ${volume.decryptedFolderPath} is mounted,` +
                `code = ${code} stdout = ${stdout}, stderr = ${stderr}`;
            throw error;

        } catch (error) {
            if (error instanceof ServiceError) throw error;
            log.error(`Error to to check whether ${volume.decryptedFolderPath} is mounted, error => ${error}`);
            throw new ServiceError(ErrorType.UnexpectedError);
        }
    }



    /**
     *  check if exists and the current user has write permission to it
     * @param path 
     */
    haveWritePermission(path: string): boolean {
        try {
            fs.accessSync(path, fs.constants.W_OK);
            return true;
        } catch (error) {
            log.debug(
                "user does not seem to have writing permisison on directory "
                + `${path} or it does not exist, resulted => ${error}`);
            return false;
        }
    }

    private exists(path: string): boolean {
        return fs.existsSync(path);
    }

    private isDirectory(path: string): boolean {
        return fs.lstatSync(path).isDirectory();
    }
    private isEmpty(path: string): boolean {
        return !fs.readdirSync(path).length;
    }
    public createDirectory(path: string) {
        fs.mkdirSync(path, 0o744);
    }
    public deleteDirectory(path: string) {
        fs.rmdirSync(path, { maxRetries: 10, recursive: true });
    }


    public isVolumeOperationsSupported(): boolean {
        const [code, stdout, stderr] = shell.execute("cryfs", [], false);
        switch (code) {
        case 0: {
            log.debug("crfs installed...");
            return true;
            break;
        }
        case 127: {
            log.debug("[127] CryFS not installed, need to present installatin instruction");
            return false;
            }
        case 7: {
            log.debug("[127] CryFS not installed, need to present installatin instruction");
            return false;
        }
        default: {
            log.error(`Error to determine if CryFS is installed, code=${code}, stdout=${stdout} stderr=${stderr}`);
            throw new ServiceError(ErrorType.ErrorToDetermineVolumeEncryptionSupport);
        }
        }
    }    
}