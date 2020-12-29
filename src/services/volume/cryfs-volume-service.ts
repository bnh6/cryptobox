import * as os from "os";
import { CommandFunction, CommandParams } from "../../types/command";
import log from "../../utils/LogUtil";
import * as shell from "../../utils/ShellUtil";
import { SupportedEncryptionServices } from "../../types/supported-encryption-services";
import { CommandsMap } from "../../types/commands-map";
import { cryFSCommands } from "../encryption/cryfs-commands/cryfs-commands";
import { EncryptionServiceActions } from "../../types/encryption-service-actions";
import { VolumeService } from "./volume-service";
import { Volume } from "../../entities/Volume";
import { ShellCommandResponse } from "../../types/shell-command-response";
import { IErrorParser } from "../../domain/services/error-parser.interface";
import { ErrorsParser } from "../errors-parser";
import { CryFSErrorMap } from "../encryption/cryfs/cryfs-errors.map";

export class CryFSVolumeService extends VolumeService {
  constructor(
    private readonly name = SupportedEncryptionServices.CryFS,
    private readonly hostOS: NodeJS.Platform = os.platform(),
    private readonly commands: CommandsMap = cryFSCommands,
    private readonly errorsParser: IErrorParser = new ErrorsParser(
      CryFSErrorMap
    )
  ) {
    super();
    this.checkIfIsAvailable();
  }

  public async mount(volume: Volume, password: string): Promise<void> {
    try {
      const isMounted = await this.isMounted(volume);
      if (isMounted) {
        log.debug(
          `volume ${volume.encryptedFolderPath} already mounted, no need to mount again.`
        );
        return;
      }

      const command = this.getCommand(EncryptionServiceActions.MOUNT);

      const response = await this.executeCommand(
        command,
        { volume, password },
        25000
      );

      if (response.code !== 0) {
        const error = this.errorsParser.parseFromResponse(response);

        log.error(
          `Error ${error} to Mount volume, code=${code} stdout=${stdout}, stderr=${stderr}`
        );
        throw error;
      }
    } catch (error) {}
  }

  public async unmount(volume: Volume): Promise<void> {}

  public async isMounted(volume: Volume): Promise<boolean> {
    try {
      const command = this.getCommand(EncryptionServiceActions.IS_MOUNTED);
      const response = await this.executeCommand(command, { volume }, 7000);

      if (response.code === 0) return true;
      if (response.code === 1) return false;

      this.throwErrorFromResponse(response);
    } catch (error) {
      if (error instanceof ServiceError) throw error;
      log.error(
        `Error to to check whether ${volume.decryptedFolderPath} is mounted, error => ${error}`
      );
      throw new ServiceError(ErrorType.UnexpectedError);
    }
  }

  private getCommand(action: EncryptionServiceActions): CommandFunction {
    return this.commands.get([this.hostOS, action, this.name]);
  }

  private checkIfIsAvailable(): void {
    const command = this.getCommand(EncryptionServiceActions.GET_VERSION);
    const [code, stdout, stderr] = shell.execute(command({}), [], false);
    if (code === 0)
      log.debug(`Volume Encryption Service ${this.name} is installed...`);

    const errorMessage = `${this.name} Encryption does not seem to be installed,\
             returned code = ${code}, stdout = ${stdout}, stderr = ${stderr}`;
    log.debug(errorMessage);
    throw Error(errorMessage);
  }

  private throwErrorFromResponse(response: ShellCommandResponse): Error {
    const message =
      `Error ${error} to check whether ${volume.decryptedFolderPath} is mounted,` +
      `code = ${code} stdout = ${stdout}, stderr = ${stderr}`;
    throw Error(message);
  }

  private async executeCommand(
    command: CommandFunction,
    params: CommandParams,
    timeout?: number
  ): Promise<ShellCommandResponse> {
    const [code, stdout, stderr] = await shell.execute(
      command(params),
      [],
      false,
      timeout
    );
    return { code, stdout, stderr };
  }
}
