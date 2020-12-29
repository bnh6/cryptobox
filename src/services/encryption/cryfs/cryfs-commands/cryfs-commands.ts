import { Command, CommandFunction } from "../../../../types/command";
import { CommandsMap } from "../../../../types/commands-map";
import { SupportedEncryptionServices } from "../../../../types/supported-encryption-services";
import { EncryptionServiceActions } from "../../../../types/encryption-service-actions";
import { cryFSLinux } from "./cryfs.linux";
import { cryFSMacOS } from "./cryfs.macOS";
import { cryFSWindows } from "./cryfs.windows";
import { SupportedOS } from "../../../../types/supported-os";

const cryFSCommands: CommandsMap = new Map<
  [
    NodeJS.Platform,
    EncryptionServiceActions,
    SupportedEncryptionServices.CryFS
  ],
  CommandFunction
>();

[]
  .concat(cryFSMacOS, cryFSLinux, cryFSWindows)
  .map((command: Command) =>
    cryFSCommands.set(
      [command.os, command.action, command.encryptionService],
      command.command
    )
  );

[SupportedOS.LINUX, SupportedOS.MACOS, SupportedOS.WINDOWS].map((os) => {
  const c: Command = {
    os: os,
    action: EncryptionServiceActions.GET_VERSION,
    encryptionService: SupportedEncryptionServices.CryFS,
    command: () => "cryfs --version",
  };
  cryFSCommands.set([c.os, c.action, c.encryptionService], c.command);
});

export { cryFSCommands };
