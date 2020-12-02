import { Volume } from "../entities/Volume";
import VolumeServiceError from "./VolumeServiceError";
import log from "../utils/LogUtil";
import * as shell from "../utils/ShellUtil";
import * as fs from "fs";

class VolumeService {

    /**
     * check if mounted,
     *      if not mounted -> mount
     *      if already mounted, do nothing
     * @param volume the paths and parameters used to mount the volume
     * @param password 
     */
    async mount(volume: Volume, password: string) {
        try {
            const alreadyMonted = await this.isMounted(volume);
            if (alreadyMonted) {
                log.debug(`volume ${volume.encryptedFolderPath} already mounted, no need to mount again.`);
                return;
            }
            const command = `echo ${password} | cryfs "${volume.encryptedFolderPath}" "${volume.decryptedFolderPath}"`;

            let [code, stdout, stderr] = await shell.execute(command, [], false, 4000)

            switch (code) {
                case 0: {
                    //success
                    break;
                }
                case 11: {
                    //wrong password
                    return false;
                }
                default: {
                    throw new VolumeServiceError(`Error to determine if CryFS is installed, \n\tcode=${code}, \n\tstdout=${stdout} \n\t=${stderr}`);
                }
            }
        } catch (error) {
            throw new VolumeServiceError(`Error to mount the ${volume.encryptedFolderPath}" -> "${volume.decryptedFolderPath}", ${error}`);
        }

    }
    async unmount(volume: Volume) {
        try {
            const alreadyMonted = await this.isMounted(volume);
            if (alreadyMonted) {
                log.debug(`volume ${volume.encryptedFolderPath} already mounted, no need to mount again.`);
                return;
            }
            const command = `cryfs-unmount "${volume.encryptedFolderPath}" `;
            let [code, stdout, stderr] = await shell.execute(command, [], false, 7000);

            //TODO continue method
    
        } catch (error) {
            throw new VolumeServiceError(`Error to UNmount the volume ${volume.encryptedFolderPath}, ${error}`);
        }
    }

    async isMounted(volume: Volume): Promise<boolean> {
        return true;
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
            console.debug(`user does not seem to have writing permisison on directory ${path} or it does not exist, resulted => ${error}`);
            return false;
        }
    }

    exists(path:string): boolean {
        return fs.existsSync(path);
    }

    isDirectory(path:string): boolean {
        return fs.lstatSync(path).isDirectory();
    }
    isEmpty(path: string): boolean {
        return !fs.readdirSync(path).length;
    }
    createDirectory(path: string) {
        fs.mkdirSync(path, 0o744);
    }
    deleteDirectory(path: string) {
        fs.rmdirSync(path);
    }


    isVolumeOperationsSupported(): boolean {
        let [code, stdout, stderr] = shell.execute("cryfs", [], false);
        switch (code) {
            case 0: {
                log.debug("crfs installed...");
                return true;
                break;
            }
            case 127: {
                log.debug("cyfs not installed, need to present installatin instruction");
                return false;
            }
            default: {
                throw new VolumeServiceError(`Error to determine if CryFS is installed, \n\tcode=${code}, \n\tstdout=${stdout} \n\t=${stderr}`);
            }
        }
    }

}

export default VolumeService;