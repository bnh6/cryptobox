import { Volume } from "../../../entities/Volume";
import VolumeServiceWrapperInterface from "./VolumeServiceWrapperInterface";
import{ ServiceError, ErrorType }  from "../../ServiceError";
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
            command = "I dont know this one yet ...";
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

    public getMountCommand(volume: Volume, password: String, unmountIdle: number = 0): string {
        let command: string;
        switch (os.platform()) {
        case "win32":
            command = "I dont know this one yet ...";
            break;
            
        case "linux":
            command = `encfs '${volume.encryptedFolderPath}' '${volume.decryptedFolderPath}' \
                --standard \
                --stdinpass='${password}' \
                --require-macs \
                -ohard_remove`;

            if (unmountIdle > 0)
                command = command + ` --idle ${unmountIdle}`;
                
            break;
            
        case "darwin":
            command = `echo '${password}' | \
                encfs '${volume.encryptedFolderPath}' '${volume.decryptedFolderPath}' \
                --stdinpass \
                --standard \
                --require-macs \
                -ovolname="${volume.name}" \
                -oallow_root \
                -olocal \
                -ohard_remove \
                -oauto_xattr 
                -onolocalcaches`;

            if (unmountIdle > 0)
                command = command + ` --idle ${unmountIdle}`;

            break;
        
        default: throw new ServiceError(ErrorType.UnsupportedOS);
        }

        return command;
    }

    public getIsMountedCommand(volume: Volume): string{
        let command: string;
        switch (os.platform()) {
        case "win32":
            command = "I dont know this one yet ...";
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
}