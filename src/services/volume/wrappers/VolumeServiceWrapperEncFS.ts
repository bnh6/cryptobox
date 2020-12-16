import { Volume } from "../../../entities/Volume";
import VolumeServiceWrapperInterface from "./VolumeServiceWrapperInterface";
import { ServiceError, ErrorType } from "../../ServiceError";
import * as os from "os";

/**
 * this class gives the commands for CryFS and it handles OS specificity
 */
export default class VolumeServiceWrapperEncFS implements VolumeServiceWrapperInterface {
    getIsVolumeOperationsSupportedCommand(): string {
        return "encfs --version";
    }


    public getUNmountCommand(volume: Volume): string {
        let command: string;
        switch (os.platform()) {
            case "win32":
                command = `encfs -u "${volume.decryptedFolderPath}"`;
                break;

            case "linux":
                command = `fusermount -u "${volume.decryptedFolderPath}"`;
                break;

            case "darwin":
                command = `umount "${volume.decryptedFolderPath}"`;
                break;

            default: throw new ServiceError(ErrorType.UnsupportedOS);
        }

        return command;
    }

    public getMountCommand(volume: Volume, password: String): string {
        let command: string;
        switch (os.platform()) {
            case "win32":
                // echo does not seem to need escape and must have no space before and after the string
                // has to be double quote instead of single
                command = `echo ${password}|encfs "${volume.encryptedFolderPath}" "${volume.decryptedFolderPath}" \
                --standard \
                --stdinpass\
                --nocache \
                --require-macs`;
                break;

            case "linux":
                command = `encfs '${volume.encryptedFolderPath}' '${volume.decryptedFolderPath}' \
                --standard \
                --stdinpass='${password}' \
                --nocache \
                --require-macs \
                -ohard_remove`;

                if (volume.ttl > 0)
                    command = command + ` --idle ${volume.ttl}`;

                break;

            case "darwin":
                command = `echo '${password}' | \
                encfs '${volume.encryptedFolderPath}' '${volume.decryptedFolderPath}' \
                --stdinpass \
                --standard \
                --nocache \
                --require-macs \
                -ovolname="${volume.name}" \
                -oallow_root \
                -olocal \
                -ohard_remove \
                -oauto_xattr 
                -onolocalcaches`;

                if (volume.ttl > 0)
                    command = command + ` --idle ${volume.ttl}`;

                break;

            default: throw new ServiceError(ErrorType.UnsupportedOS);
        }

        return command;
    }

    public getIsMountedCommand(volume: Volume): string {
        let command: string;
        switch (os.platform()) {
            case "win32":
                command = `if exist "${volume.decryptedFolderPath}" (exit /b 0) else (exit /b 1)`;
                break;

            case "linux":
                command = `mount | grep -qs '${volume.decryptedFolderPath}'`;
                break;

            case "darwin":
                command = `mount | grep -qs '${volume.decryptedFolderPath}'`;
                break;

            default: throw new ServiceError(ErrorType.UnsupportedOS);
        }
        return command;
    }

    proccessErrorCode(code: number): ServiceError {
        return new ServiceError(0);
    }
}