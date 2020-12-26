import { Volume } from "../../../entities/Volume";
import VolumeServiceWrapperInterface from "./VolumeServiceWrapperInterface";
import { ServiceError, ErrorType } from "../../ServiceError";
import * as os from "os";
import * as shell from "../../../utils/ShellUtil";


/**
 * this class gives the commands for CryFS and it handles OS specificity
 */
export default class VolumeServiceWrapperCryFS implements VolumeServiceWrapperInterface {
    getIsVolumeOperationsSupportedCommand(): string {
        return "cryfs --version";
    }

    public getUNmountCommand(volume: Volume): string {
        //cryfs expects the decrypted folder, and give an error on the encrypted one.
        let command = `cryfs-unmount "${volume.decryptedFolderPath}" `;

        if (os.platform() === "linux") { // TODO, investigate why ubuntu is returning "cryfs-unmount: not found"
            command = `fusermount -u "${volume.decryptedFolderPath}"`;
        }

        return command;
    }

    public getMountCommand(volume: Volume, password: String): string {
        let command: string = "";

        if (os.platform() === "win32") {
            // pipe on powershell instantiate a new cmd.exe, hence CRYFS_FRONTEND must be global
            command =
                ` set "CRYFS_FRONTEND=noninteractive" && \
                echo '${password}' | START /B cryfs --foreground \
                "${volume.encryptedFolderPath}" "${volume.decryptedFolderPath}"`;
        }
        else {
            command = "export CRYFS_FRONTEND=noninteractive && " +
                `echo '${password}' | cryfs "${volume.encryptedFolderPath}" "${volume.decryptedFolderPath}"`;
        }

        if (volume.ttl > 0)
            command = command + ` --unmount-idle ${volume.ttl} `;

        return command;
    }

    // public getIsMountedCommand(volume: Volume): string {
    //     return `mount | grep -qs '${volume.encryptedFolderPath}'`;
    // }
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


    proccessErrorCode(code: number, stderr:string): ServiceError {
        return ServiceError.errorFromCryFS(code);
    }
}