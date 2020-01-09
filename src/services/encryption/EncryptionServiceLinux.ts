import { Volume } from "../../entities/Volume";
import { EncryptionService } from "./EncryptionService";
import { EncryptionServiceBase } from "./EncryptionServiceBase";

export class EncryptionServiceLinux extends EncryptionServiceBase
  implements EncryptionService {
  getIsMountedCMD(volume: Volume): string {
    return `mount | grep -qs '${volume.decryptedFolderPath}'`;
  }

  getUnmountCMD(volume: Volume): string {
    return `umount "${volume.decryptedFolderPath}"`;
  }

  getMountCMD(volume: Volume, passwordCommand: string): string {
    let impl = "encfs";
    return `${impl} ${volume.encryptedFolderPath} ${volume.decryptedFolderPath} --standard --extpass='${passwordCommand}' --require-macs -ohard_remove --idle=${volume.ttl}`;
  }
}

// module.exports = { EncryptionManagerLinux: EncryptionServiceLinux };
