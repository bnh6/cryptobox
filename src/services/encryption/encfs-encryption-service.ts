import * as os from "os";
import { CommandFunction } from "../../types/command";
import log from "../../utils/LogUtil";
import * as shell from "../../utils/ShellUtil";
import { SupportedEncryptionServices } from "../../types/supported-encryption-services";
import { EncryptionService } from "../../domain/services/encryption-service.interface";
import { encFSCommands } from "./encfs-commands/encfs-commands";
import { CommandsMap } from "../../types/commands-map";
import { EncryptionServiceActions } from "../../types/encryption-service-actions";

export class EncFSEncryptionService implements EncryptionService {
  constructor(
    private readonly name = SupportedEncryptionServices.EncFS,
    private readonly hostOS: NodeJS.Platform = os.platform(),
    private readonly commands: CommandsMap = encFSCommands
  ) {
    this.checkIfIsAvailable();
  }

  public getCommand(action: EncryptionServiceActions): CommandFunction {
    return this.commands.get([this.hostOS, action, this.name]);
  }

  public checkIfIsAvailable(): void {
    const command = this.getCommand(EncryptionServiceActions.GET_VERSION);
    const [code, stdout, stderr] = shell.execute(command({}), [], false);
    if (code === 0)
      log.debug(`Volume Encryption Service ${this.name} is installed...`);

    const errorMessage = `${this.name} Encryption does not seem to be installed,\
             returned code = ${code}, stdout = ${stdout}, stderr = ${stderr}`;
    log.debug(errorMessage);
    throw Error(errorMessage);
  }
}
