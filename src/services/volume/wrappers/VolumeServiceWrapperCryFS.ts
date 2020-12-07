import { Volume } from "../../../entities/Volume";
import VolumeServiceWrapperInterface from "./VolumeServiceWrapperInterface";


/**
 * this class gives the commands for CryFS and it handles OS specificity
 */
export default class VolumeServiceWrapperCryFS implements VolumeServiceWrapperInterface {
    getIsVolumeOperationsSupportedCommand(): string {
        return "cryfs --version";
    }
    
    public getUNmountCommand(volume: Volume): string{
        //cryfs expects the decrypted folder, and give an error on the encrypted one.
        return `cryfs-unmount "${volume.decryptedFolderPath}" `; 
    }

    public getMountCommand(volume: Volume, password: String, unmountIdle: number = 0): string {
        let command = "export CRYFS_FRONTEND=noninteractive; " +
            `echo ${password} | cryfs "${volume.encryptedFolderPath}" "${volume.decryptedFolderPath}"`;
        
        if (unmountIdle > 0)
            command = command + ` --unmount-idle ${unmountIdle}`;
        
        return command;
    }

    public getIsMountedCommand(volume: Volume): string{
        return `mount | grep -qs '${volume.encryptedFolderPath}'`;
    }
}