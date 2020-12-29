import { Command, CommandParams } from "../../../types/command";
import { SupportedEncryptionServices } from "../../../types/supported-encryption-services";
import { SupportedOS } from "../../../types/supported-os";
import { EncryptionServiceActions } from "../../../types/encryption-service-actions";

export const cryFSWindows: Command[] = [
  {
    os: SupportedOS.WINDOWS,
    action: EncryptionServiceActions.MOUNT,
    encryptionService: SupportedEncryptionServices.CryFS,
    command: (params: CommandParams) => {
      const { volume, password } = params;
      // pipe on powershell instantiate a new cmd.exe, hence CRYFS_FRONTEND must be global
      return ` set "CRYFS_FRONTEND=noninteractive" && \
                echo '${password}' | START /B cryfs --foreground \
                "${volume.encryptedFolderPath}" "${volume.decryptedFolderPath}"`;
    },
  },
  {
    os: SupportedOS.WINDOWS,
    action: EncryptionServiceActions.UNMOUNT,
    encryptionService: SupportedEncryptionServices.CryFS,
    command: (params: CommandParams) =>
      `cryfs-unmount "${params.volume.decryptedFolderPath}" `,
  },
  {
    os: SupportedOS.WINDOWS,
    action: EncryptionServiceActions.IS_MOUNTED,
    encryptionService: SupportedEncryptionServices.CryFS,
    command: (params: CommandParams) =>
      `if exist "${params.volume.decryptedFolderPath}" (exit /b 0) else (exit /b 1)`,
  },
];
