import { Volume } from "../../entities/Volume";
import { EncryptionService } from "./EncryptionService";
import { EncryptionServiceBase } from "./EncryptionServiceBase";

export class EncryptionServiceOSX extends EncryptionServiceBase
  implements EncryptionService {
  getIsMountedCMD(volume: Volume): string {
    return `mount | grep -qs '${volume.decryptedFolderPath}'`;
  }

  getUnmountCMD(volume: Volume): string {
    return `umount "${volume.decryptedFolderPath}"`;
  }

  getMountCMD(volume: Volume, passwordCommand: string): string {
    let impl = "encfs";

    return (
      `${impl} '${volume.encryptedFolderPath}' '${volume.decryptedFolderPath}' ` +
      `--extpass='${passwordCommand}'  --idle=${volume.ttl} ` +
      `--standard --require-macs -ovolname="${volume.name}" ` +
      "-oallow_root -olocal -ohard_remove -oauto_xattr -onolocalcaches"
    );

    // return `${impl}  ${volume.encryptedFolderPath} ${volume.decryptedFolderPath} --extpass='${passwordCommand}';
  }
}
