import { Command, CommandParams } from "../../../types/command";
import { SupportedEncryptionServices } from "../../../types/supported-encryption-services";
import { SupportedOS } from "../../../types/supported-os";
import { EncryptionServiceActions } from "../../../types/encryption-service-actions";

export const cryFSLinux: Command[] = [
  {
    os: SupportedOS.LINUX,
    action: EncryptionServiceActions.MOUNT,
    encryptionService: SupportedEncryptionServices.CryFS,
    command: (params: CommandParams) => {
      const { volume, password } = params;
      const command = ` export CRYFS_FRONTEND=noninteractive &&  
            echo '${password}' | cryfs "${volume.encryptedFolderPath}" "${volume.decryptedFolderPath}"`;

      return volume.ttl > 0
        ? command + ` --unmount-idle ${volume.ttl} `
        : command;
    },
  },
  {
    os: SupportedOS.LINUX,
    action: EncryptionServiceActions.UNMOUNT,
    encryptionService: SupportedEncryptionServices.CryFS,
    command: (params: CommandParams) =>
      `fusermount -u "${params.volume.decryptedFolderPath}"`,
  },
  {
    os: SupportedOS.LINUX,
    action: EncryptionServiceActions.IS_MOUNTED,
    encryptionService: SupportedEncryptionServices.CryFS,
    command: (params: CommandParams) =>
      `mount | grep -qs '${params.volume.decryptedFolderPath}'`,
  },
];
