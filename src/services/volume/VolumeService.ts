import { Volume } from "../../entities/Volume";
import log from "../../utils/LogUtil";
import * as shell from "../../utils/ShellUtil";
import * as fs from "fs";
import VolumeServiceInterface from "./VolumeServiceInterface";
import { ServiceError, ErrorType } from "../ServiceError";
import VolumeServiceWrapperInterface from "./wrappers/VolumeServiceWrapperInterface";
import { VolumeServiceWrapperFactory, VolumeEncryptionImpl } from "./wrappers/VolumeServiceWrapperFactory";


export default class VolumeService implements VolumeServiceInterface {

    private wrapper: VolumeServiceWrapperInterface;
    private volEncImpl: VolumeEncryptionImpl;

    constructor(whichImpl: VolumeEncryptionImpl = VolumeEncryptionImpl.CryFS) {
        this.wrapper = VolumeServiceWrapperFactory.create(whichImpl);
        this.volEncImpl = whichImpl;
    }

    /**
     * check if mounted,
     *      if not mounted -> mount
     *      if already mounted, do nothing
     * @param volume the paths and parameters used to mount the volume
     * @param password 
     */
    public async mount(volume: Volume, password: string): Promise<void> {
        try {
            const alreadyMonted = await this.isMounted(volume);
            if (alreadyMonted) {
                log.debug(`volume ${volume.encryptedFolderPath} already mounted, no need to mount again.`);
                return;
            }

            const command = this.wrapper.getMountCommand(volume, password);
            const [code, stdout, stderr] = await shell.execute(command, [], false, 25000);

            if (code === 0) return;
            else {
                const error = ServiceError.errorFromCryFS(code);
                log.error(`Error ${error} to Mount volume, code=${code} stdout=${stdout}, stderr=${stderr}`);
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
            const command = this.wrapper.getUNmountCommand(volume);
            const [code, stdout, stderr] = await shell.execute(command, [], false, 60000);

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
            return false;
            const command = this.wrapper.getIsMountedCommand(volume);
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
        fs.mkdirSync(path, {
            mode: 0o744,
            recursive: true,
        });
    }
    public deleteDirectory(path: string) {
        fs.rmdirSync(path, { maxRetries: 10, recursive: true });
    }


    public isVolumeOperationsSupported(): boolean {
        const command = this.wrapper.getIsVolumeOperationsSupportedCommand();
        const [code, stdout, stderr] = shell.execute(command, [], false);

        if (code === 0) {
            log.debug("Volume Encryption not installed...");
            return true;
        } else {
            log.debug(`${this.volEncImpl.toString()} Encryption does not seem to be installed,\
             returned code = ${code}, stdout = ${stdout}, stderr = ${stderr}`);
            return false;
        }
    }
}