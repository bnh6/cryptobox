import { ServiceError } from "../../ServiceError";
import { Volume } from "../../../entities/Volume";
import VolumeServiceWrapperInterface from "./VolumeServiceWrapperInterface";
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
        return `cryfs-unmount "${volume.decryptedFolderPath}" `;
    }

    public getMountCommand(volume: Volume, password: String): string {
        // const [code1, stdout1, stderr1] = shell.execute(`dir ${os.homedir()} `, [], false);
        // const c = "$Env:CRYFS_FRONTEND=\"noninteractive\" && $Env:CRYFS_FRONTEND";
        // const c = "set CRYFS_FRONTEND 'noninteractive' && echo %CRYFS_FRONTEND%";
        // const [code1, stdout1, stderr1] = shell.execute(c, [], false);
        // console.log("RESULTADO==", code1, stdout1, stderr1);

        let setvarLiteral: string = "";
        if (os.platform() === "win32")
            // setvarLiteral = "set CRYFS_FRONTEND=noninteractive";
            // setvarLiteral = "$Env:CRYFS_FRONTEND=\"noninteractive\"";
            // setvarLiteral = " setx CRYFS_FRONTEND 'noninteractive' && ";
            // setvarLiteral = " set \"CRYFS_FRONTEND=noninteractive\" && "; // worked
            setvarLiteral = " setx /M CRYFS_FRONTEND \"noninteractive\" && "; // worked
        else
            setvarLiteral = "export CRYFS_FRONTEND=noninteractive && ";

        // let command = `${setvarLiteral}   ` +
        //     `echo ${password} | cryfs "${volume.encryptedFolderPath}" "${volume.decryptedFolderPath}"`;

        return `${setvarLiteral} echo  'hello world'`;

        if (volume.ttl > 0)
            command = command + ` --unmount-idle ${volume.ttl}`;

        return command;
    }

    public getIsMountedCommand(volume: Volume): string {
        return `mount | grep -qs '${volume.encryptedFolderPath}'`;
    }

    proccessErrorCode(code: number): ServiceError {
        return new ServiceError(0);
    }
}