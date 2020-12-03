import { Volume } from "../../entities/Volume";
import VolumeServiceError from "./VolumeServiceError";
import log from "../../utils/LogUtil";
import * as shell from "../../utils/ShellUtil";
import * as fs from "fs";
import PasswordServiceError from "../password/PasswordError";
import VolumeServiceInterface from "./VolumeInterface";

class VolumeService implements VolumeServiceInterface {

    /**
     * check if mounted,
     *      if not mounted -> mount
     *      if already mounted, do nothing
     * @param volume the paths and parameters used to mount the volume
     * @param password 
     */
    public async mount(volume: Volume, password: string) {
        try {
            const alreadyMonted = await this.isMounted(volume);
            if (alreadyMonted) {
                log.debug(`volume ${volume.encryptedFolderPath} already mounted, no need to mount again.`);
                return;
            }
            const command =
                `export CRYFS_FRONTEND=noninteractive; ` +
                `echo ${password} | cryfs "${volume.encryptedFolderPath}" "${volume.decryptedFolderPath}"`;

            const [code, stdout, stderr] = await shell.execute(command, [], false, 25000);

            if (code === 0) return;
            else {
                const errorLabel = this.treatCryFSError(code);
                const msg = `Error ${errorLabel} to UNmount volume, stdout=${stdout}, stderr=${stderr}`;
                throw new VolumeServiceError(msg);
            }
        } catch (error) {
            if (error instanceof VolumeServiceError)
                throw error;
            if (error instanceof PasswordServiceError)
                throw new VolumeServiceError(error.message)

            throw new VolumeServiceError(
                `Error to mount the ${volume.encryptedFolderPath}" -> "${volume.decryptedFolderPath}", ${error}`);
        }

    }
    public async unmount(volume: Volume) {
        try {
            const alreadyMonted = await this.isMounted(volume);
            if (alreadyMonted) {
                log.debug(`volume ${volume.encryptedFolderPath} already mounted, no need to mount again.`);
                return;
            }
            const command = `cryfs-unmount "${volume.decryptedFolderPath}" `; // cryfs expected the decrypted fodler.
            const [code, stdout, stderr] = await shell.execute(command, [], false, 7000);

            if (code === 0) return;
            else {
                const errorLabel = this.treatCryFSError(code);
                const msg = `Error ${errorLabel} to UNmount volume, stdout=${stdout}, stderr=${stderr}`;
                throw new VolumeServiceError(msg);
            }
        } catch (error) {
            if (error instanceof VolumeServiceError)
                throw error;

            throw new VolumeServiceError(
                `Error to UNmount the volume ${volume.encryptedFolderPath}, ${error}`);
        }
    }

    public async isMounted(volume: Volume): Promise<boolean> {
        try {
            const command = `mount | grep -qs '${volume.encryptedFolderPath}'`

            const [code, stdout, stderr] = await shell.execute(command, [], false, 7000);

            if (code === 0) return true;
            if (code === 1) return false;


            const errorLabel = this.treatCryFSError(code);
            const msg = `Error ${errorLabel} to check whether ${volume.decryptedFolderPath} is mounted,` +
                `code = ${code} stdout = ${stdout}, stderr = ${stderr}`;
            throw new VolumeServiceError(msg);

        } catch (error) {
            if (error instanceof VolumeServiceError)
                throw error;

            throw new VolumeServiceError(
                `Error to to check whether ${volume.decryptedFolderPath} is mounted, error => ${error}`)
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
            console.debug(
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
                log.debug("cyfs not installed, need to present installatin instruction");
                return false;
            }
            default: {
                throw new VolumeServiceError(
                    `Error to determine if CryFS is installed, code=${code}, stdout=${stdout} stderr=${stderr}`);
            }
        }
    }

    private treatCryFSError(code: number): string {
        const errorMap = new Map([
            // An error happened that doesn't have an error code associated with it
            [1, "UnspecifiedError"],
            // The command line arguments are invalid.
            [10, "InvalidArguments"],
            // Couldn't load config file. Probably the password is wrong
            [11, "WrongPassword"],
            // Password cannot be empty
            [12, "EmptyPassword"],
            // The file system format is too new for this CryFS version. Please update your CryFS version.
            [13, "TooNewFilesystemFormat"],
            // The file system format is too old for this CryFS version. 
            // Run with --allow - filesystem - upgrade to upgrade it.
            [14, "TooOldFilesystemFormat"],
            // The file system uses a different cipher than the one specified on the command line
            // using the--cipher argument.
            [13, "WrongCipher"],
            // Base directory doesn't exist or is inaccessible (i.e. not read or writable or not a directory)
            [16, "InaccessibleBaseDir"],
            // Mount directory doesn't exist or is inaccessible (i.e. not read or writable or not a directory)
            [17, "InaccessibleMountDir"],
            // Base directory can't be a subdirectory of the mount directory
            [18, "BaseDirInsideMountDir"],
            // Something's wrong with the file system.
            [19, "InvalidFilesystem"],
            // The filesystem id in the config file is different to the last time we loaded 
            // a filesystem from this basedir. 
            // This could mean an attacker replaced the file system with a different one.
            // You can pass the--allow - replaced - filesystem option to allow this.
            [20, "FilesystemIdChanged"],
            // The filesystem encryption key differs from the last time we loaded this filesystem. 
            // This could mean an attacker replaced the file system with a different one.
            // You can pass the--allow - replaced - filesystem option to allow this.
            [21, "EncryptionKeyChanged"],
            // The command line options and the file system disagree on whether missing blocks 
            // should be treated as integrity violations.
            [22, "FilesystemHasDifferentIntegritySetup"],
            // File system is in single-client mode and can only be used from the client that created it.
            [23, "SingleClientFileSystem"],
            // A previous run of the file system detected an integrity violation. 
            // Preventing access to make sure the user notices.
            // The file system will be accessible again after the user deletes the integrity state file.
            [24, "IntegrityViolationOnPreviousRun"],
            // An integrity violation was detected and the file system unmounted to make sure the user notices.
            [25, "IntegrityViolation"]
        ]);

        if (!errorMap.has(code))
            return errorMap.get(1);//unknown error code
        else
            return errorMap.get(code);
    }
}

export default VolumeService;