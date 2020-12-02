import { Volume } from "../../entities/Volume";
import { EncryptionService } from "./EncryptionService";
import PasswordService from "../PasswordService";

import log from "../../utils/LogUtil";
import * as ShellHelper from "../../utils/ShellUtil";

export abstract class EncryptionServiceBase implements EncryptionService {
    abstract getMountCMD(volume: Volume, passwordCommand: string): string;

    abstract getUnmountCMD(volume: Volume): string;

    abstract getIsMountedCMD(volume: Volume): string;

    unmount(volume: Volume): void {
        log.debug(`unmounting ${volume.decryptedFolderPath}`);
        if (this.isMounted(volume)) {
            log.debug(
                `volume [${volume.decryptedFolderPath}] mounted, unmounting ...`
            );
            ShellHelper.execute(this.getUnmountCMD(volume));
        } else {
            log.debug(
                `volume[${volume.decryptedFolderPath}] NOT mounted, nothing do unmount ...`
            );
        }
    }

    isMounted(volume: Volume): boolean {
        log.debug(`checking if "${volume.decryptedFolderPath}" is mounted`);

        const cmd = this.getIsMountedCMD(volume);
        log.debug(`checking if is mounted command: ${cmd}`);

        const [statusCode, stdout, stderr] = ShellHelper.execute(cmd, [], false);

        if (statusCode == 0) {
            log.info(`folder [${volume.decryptedFolderPath}] is already mounted`);
            return true;
        } else if (statusCode == 1) {
            log.info(`folder [${volume.decryptedFolderPath}] is NOT mounted`);
            return false;
        } else {
            const msg = `Failed to check is [${volume.decryptedFolderPath}] \
      mounted\n\n return = ${statusCode}\n\n \
      stderr=[${stderr}] \n\n stdout=[${stdout}]`;
            log.error(msg);
            return false;
        }
    }

    mount(volume: Volume): void {
        log.debug(
            `about to mount directory [${volume.encryptedFolderPath}] \
      into [${volume.decryptedFolderPath}] with volumeName [${volume.name}]`
        );
        if (this.isMounted(volume)) {
            log.debug(
                `volume [${volume.decryptedFolderPath}] mounted, nothing to mount ...`
            );
            return;
        } else {
            log.debug(
                `volume[${volume.decryptedFolderPath}] NOT mounted, mounting ...`
            );

            const passwordService = new PasswordService();
            const mountCMD = this.getMountCMD(
                volume,
                "" //TODO won't work
            );

            ShellHelper.execute(`mkdir -p "${volume.decryptedFolderPath}"`); //TODO here is the place for it.

            log.debug(`mounting command [${mountCMD}]`);
            log.debug(
                `mounting directory [${volume.encryptedFolderPath}] \
        into [${volume.decryptedFolderPath}] with volumeName [${volume.name}]`
            );
            console.time();
            ShellHelper.execute(mountCMD);
            console.timeEnd();
        }
    }
}
