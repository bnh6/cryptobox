import { constants } from "../utils/constants";
import * as path from "path";
import * as os from "os";

export class Volume {
    name: string;
    ttl: number;
    encryptedFolderPath: string;
    decryptedFolderPath: string;

    constructor(encryptedFolderPath: string, ttl: number = 0) {
        this.encryptedFolderPath = encryptedFolderPath;
        this.ttl = ttl;
        this.name = String(path.parse(this.encryptedFolderPath).base);
        this.decryptedFolderPath = String(
            path.join(os.homedir(), "cryptobox", this.name)
        );
    }

    getVolumeAlias(): string | null {
        if (this.encryptedFolderPath)
            return `${constants.VOLUME_ALIAS_SUFFIX}://${this.encryptedFolderPath}`;
        else return null;
    }
}
