import { Command, CommandFunction } from "../../../types/command";
import { CommandsMap } from "../../../types/commands-map";
import { SupportedEncryptionServices } from "../../../types/supported-encryption-services";
import { EncryptionServiceActions } from "../../../types/encryption-service-actions";
import { encFSLinux } from "./encfs.linux";
import { encFSMacOS } from "./encfs.macOS";
import { encFSWindows } from "./encfs.windows";
import { SupportedOS } from "../../../types/supported-os";

const encFSCommands: CommandsMap = new Map<
  [
    NodeJS.Platform,
    EncryptionServiceActions,
    SupportedEncryptionServices.EncFS
  ],
  CommandFunction
>();

[]
  .concat(encFSMacOS, encFSLinux, encFSWindows)
  .map((command: Command) =>
    encFSCommands.set(
      [command.os, command.action, command.encryptionService],
      command.command
    )
  );

[SupportedOS.LINUX, SupportedOS.MACOS, SupportedOS.WINDOWS].map((os) => {
  const c: Command = {
    os: os,
    action: EncryptionServiceActions.GET_VERSION,
    encryptionService: SupportedEncryptionServices.CryFS,
    command: () => "encfs --version",
  };
  encFSCommands.set([c.os, c.action, c.encryptionService], c.command);
});

export { encFSCommands };
