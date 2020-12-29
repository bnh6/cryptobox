import { Command, CommandParams } from "../../../../types/command";
import { EncryptionServiceActions } from "../../../../types/encryption-service-actions";
import { SupportedEncryptionServices } from "../../../../types/supported-encryption-services";
import { SupportedOS } from "../../../../types/supported-os";

export const encFSWindows: Command[] = [
  {
    os: SupportedOS.WINDOWS,
    action: EncryptionServiceActions.MOUNT,
    encryptionService: SupportedEncryptionServices.EncFS,
    command: (params: CommandParams) =>
      // echo does not seem to need escape and must have no space before and after the string
      // has to be double quote instead of single
      `echo ${params.password}|encfs "${params.volume.encryptedFolderPath}" "${params.volume.decryptedFolderPath}" \
                --standard \
                --stdinpass\
                --nocache \
                --require-macs`,
  },
  {
    os: SupportedOS.WINDOWS,
    action: EncryptionServiceActions.UNMOUNT,
    encryptionService: SupportedEncryptionServices.EncFS,
    command: (params: CommandParams) =>
      `encfs -u "${params.volume.decryptedFolderPath}"`,
  },
  {
    os: SupportedOS.WINDOWS,
    action: EncryptionServiceActions.IS_MOUNTED,
    encryptionService: SupportedEncryptionServices.EncFS,
    command: (params: CommandParams) =>
      `if exist "${params.volume.decryptedFolderPath}" (exit /b 0) else (exit /b 1)`,
  },
];
