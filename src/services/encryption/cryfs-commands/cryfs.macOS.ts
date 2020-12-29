import { Command, CommandParams } from "../../../types/command";
import { EncryptionServiceActions } from "../../../types/encryption-service-actions";
import { SupportedEncryptionServices } from "../../../types/supported-encryption-services";
import { SupportedOS } from "../../../types/supported-os";

export const cryFSMacOS: Command[] = [
  {
    os: SupportedOS.MACOS,
    action: EncryptionServiceActions.IS_MOUNTED,
    encryptionService: SupportedEncryptionServices.CryFS,
    command: (params: CommandParams) =>
      `mount | grep -qs '${params.volume.decryptedFolderPath}'`,
  },
  {
    os: SupportedOS.MACOS,
    action: EncryptionServiceActions.UNMOUNT,
    encryptionService: SupportedEncryptionServices.CryFS,
    command: (params: CommandParams) =>
      //cryfs expects the decrypted folder, and give an error on the encrypted one.
      `cryfs-unmount "${params.volume.decryptedFolderPath}" `,
  },
  {
    os: SupportedOS.MACOS,
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
];
