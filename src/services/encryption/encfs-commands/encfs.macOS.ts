import { Command, CommandParams } from "../../../types/command";
import { EncryptionServiceActions } from "../../../types/encryption-service-actions";
import { SupportedEncryptionServices } from "../../../types/supported-encryption-services";
import { SupportedOS } from "../../../types/supported-os";

export const encFSMacOS: Command[] = [
  {
    os: SupportedOS.MACOS,
    action: EncryptionServiceActions.IS_MOUNTED,
    encryptionService: SupportedEncryptionServices.EncFS,
    command: (params: CommandParams) =>
      `mount | grep -qs '${params.volume.decryptedFolderPath}'`,
  },
  {
    os: SupportedOS.MACOS,
    action: EncryptionServiceActions.UNMOUNT,
    encryptionService: SupportedEncryptionServices.EncFS,
    command: (params: CommandParams) =>
      `umount "${params.volume.decryptedFolderPath}"`,
  },
  {
    os: SupportedOS.MACOS,
    action: EncryptionServiceActions.MOUNT,
    encryptionService: SupportedEncryptionServices.EncFS,
    command: (params: CommandParams) => {
      const command = `echo '${params.password}' | \
      encfs '${params.volume.encryptedFolderPath}' '${params.volume.decryptedFolderPath}' \
      --stdinpass \
      --standard \
      --nocache \
      --require-macs \
      -ovolname="${params.volume.name}" \
      -oallow_root \
      -olocal \
      -ohard_remove \
      -oauto_xattr 
      -onolocalcaches`;

      return params.volume.ttl > 0
        ? command
        : command + ` --idle ${params.volume.ttl}`;
    },
  },
];
