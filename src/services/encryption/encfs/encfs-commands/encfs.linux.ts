import { Command, CommandParams } from "../../../../types/command";
import { EncryptionServiceActions } from "../../../../types/encryption-service-actions";
import { SupportedEncryptionServices } from "../../../../types/supported-encryption-services";
import { SupportedOS } from "../../../../types/supported-os";

export const encFSLinux: Command[] = [
  {
    os: SupportedOS.LINUX,
    action: EncryptionServiceActions.MOUNT,
    encryptionService: SupportedEncryptionServices.EncFS,
    command: (params: CommandParams) => {
      const { volume, password } = params;
      const command = `echo '${password}' | \
      encfs '${volume.encryptedFolderPath}' '${volume.decryptedFolderPath}' \
     --standard \
     --stdinpass \
     --nocache \
     --require-macs \
     -ohard_remove`;

      return volume.ttl > 0 ? command : command + ` --idle ${volume.ttl}`;
    },
  },
  {
    os: SupportedOS.LINUX,
    action: EncryptionServiceActions.UNMOUNT,
    encryptionService: SupportedEncryptionServices.EncFS,
    command: (params: CommandParams) =>
      `fusermount -u "${params.volume.decryptedFolderPath}"`,
  },
  {
    os: SupportedOS.LINUX,
    action: EncryptionServiceActions.IS_MOUNTED,
    encryptionService: SupportedEncryptionServices.EncFS,
    command: (params: CommandParams) =>
      `mount | grep -qs '${params.volume.decryptedFolderPath}'`,
  },
];
