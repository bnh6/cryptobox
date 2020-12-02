import log from "../utils/LogUtil";
import { EncryptionService } from "../services/encryption/EncryptionService";
import { EncryptionServiceFactory } from "../services/encryption/EncryptionServiceFactory";

import { Password } from "../entities/Password";
import { Volume } from "../entities/Volume";

// let response_example = {
//   status: "operation with success/error",
//   message:
//     "detailed message, not to be displayed to user, it will contain stacktraces...",
//   isMounted: "boolean",
// };

export class MountVolume {
    encryptionService: EncryptionService;
    password: Password;
    volume: Volume;

    constructor(volume: Volume) {
        this.encryptionService = EncryptionServiceFactory.create();
        this.volume = volume;
    }

    public async mount(): Promise<{ [k: string]: any; }> {
        const response: { [k: string]: any } = {};

        try {
            response.volume = this.volume;

            // TODO fix it
            // const passwordApp = new PasswordApplication();
            // if (!passwordApp.passwordExists(this.volume)) {
            //     response.status = "error";
            //     response.message = `try again when there is a password for ${this.volume.encryptedFolderPath}`;
            //     return response;
            // }

            const isMounted = this.encryptionService.isMounted(this.volume);
            response.isMounted = isMounted;
            log.info(`${this.volume} is already mounted? = ${isMounted}`);

            if (isMounted) {
                this.encryptionService.unmount(this.volume);
                response.message = "volume unmounted!";
            } else {
                this.encryptionService.mount(
                    this.volume,
                    await passwordApp.findPassword(this.volume)
                );
                response.message = "volume mounted!";
            }

            response.status = "success";
        } catch (error) {
            log.error("there was an error to mound/umount the volume ", error);
            response.status = "error";
            response.message = "operation failed :(";
            response.error = error;
            // throw new Error(error);
        }
        return response;
    }

    public isMount(): { [k: string]: any } {
        let response: { [k: string]: any } = {};

        try {
            response.volume = this.volume;
            response.isMounted = this.encryptionService.isMounted(this.volume);

            let isMounted = this.encryptionService.isMounted(this.volume);
            response.isMounted = isMounted;

            response.status = "success";
        } catch (error) {
            response.status = "error";
            response.message = "operation failed :(";
            response.error = error;
            // throw new Error(error);
        }
        return response;
    }
}
