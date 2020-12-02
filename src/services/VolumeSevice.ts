import { Volume } from "../entities/Volume";
import VolumeServiceError from "./VolumeServiceError";
import log from "../utils/LogUtil";
import * as shell from "../utils/ShellUtil";

export class VolumeService {

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

        } catch (error) {
            throw new VolumeServiceError(`Error to mount the volume, ${error}`);
        }

    }
    async unmount(volume: Volume) {

    }

    async isMounted(volume: Volume): Promise<boolean> {
        return true;

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
