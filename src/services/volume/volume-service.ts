import * as os from "os";
import { CommandFunction, CommandParams } from "../../types/command";
import log from "../../utils/LogUtil";
import * as shell from "../../utils/ShellUtil";
import { SupportedEncryptionServices } from "../../types/supported-encryption-services";
import { CommandsMap } from "../../types/commands-map";
import { cryFSCommands } from "../encryption/cryfs/cryfs-commands/cryfs-commands";
import { EncryptionServiceActions } from "../../types/encryption-service-actions";
import { Volume } from "../../entities/Volume";
import { ShellCommandResponse } from "../../types/shell-command-response";
import { IErrorHandler } from "../../domain/services/error-handler.interface";
import { ErrorsHandler } from "../errors-handler";
import { CryFSErrorMap } from "../encryption/cryfs/cryfs-errors.map";
import { ErrorsType } from "../../types/errors-type";
import { CustomError } from "../custom-error";
import * as fs from "fs";
import { IVolumeService } from "../../domain/services/volume-service.interface";

export class VolumeService implements IVolumeService {
  constructor(
    private readonly name: SupportedEncryptionServices, // = SupportedEncryptionServices.CryFS,
    private readonly hostOS: NodeJS.Platform = os.platform(),
    private readonly commands: CommandsMap, //= cryFSCommands,
    private readonly errorsHandler: IErrorHandler // = new ErrorsHandler(CryFSErrorMap)
  ) {
    this.checkIfIsAvailable();
  }

  public async mount(volume: Volume, password: string): Promise<void> {
    try {
      const action = EncryptionServiceActions.MOUNT;
      const isMounted = await this.isMounted(volume);
      if (isMounted) {
        log.debug(`volume ${volume.encryptedFolderPath} is already mounted.`);
        return;
      }
      const response = await this.executeCommand(
        action,
        { volume, password },
        25000
      );

      if (response.code !== 0)
        this.errorsHandler.throwFromResponse(response, action);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      const message = `Error to mount the ${volume.encryptedFolderPath}" -> "${volume.decryptedFolderPath}", ${error}`;
      log.error(message);
      throw new Error(ErrorsType.UnexpectedError);
    }
  }

  public async unmount(volume: Volume): Promise<void> {
    try {
      const action = EncryptionServiceActions.UNMOUNT;
      const isMounted = await this.isMounted(volume);
      if (!isMounted) {
        log.debug(`volume ${volume.encryptedFolderPath} already UnMounted.`);
        return;
      }
      const response = await this.executeCommand(action, { volume }, 60000);

      if (response.code === 0) return;

      this.errorsHandler.throwFromResponse(response, action);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      log.error(
        `Error to UNmount the volume ${volume.encryptedFolderPath}, ${error}`
      );
      throw new Error(ErrorsType.UnexpectedError);
    }
  }

  public async isMounted(volume: Volume): Promise<boolean> {
    try {
      const action = EncryptionServiceActions.IS_MOUNTED;
      const response = await this.executeCommand(action, { volume }, 7000);

      if (response.code === 0) return true;
      if (response.code === 1) return false;

      this.errorsHandler.throwFromResponse(response, action);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      log.error(
        `Error to to check if ${volume.decryptedFolderPath} is mounted, error => ${error}`
      );
      throw new Error(ErrorsType.UnexpectedError);
    }
  }

  private async checkIfIsAvailable(): Promise<void> {
    const action = EncryptionServiceActions.GET_VERSION;
    const response = await this.executeCommand(action, {});
    if (response.code === 0)
      log.debug(`Volume Encryption Service ${this.name} is installed...`);

    this.errorsHandler.throwFromResponse(response, action);
    // const errorMessage = `${this.name} Encryption does not seem to be installed,\
    //          returned code = ${code}, stdout = ${stdout}, stderr = ${stderr}`;
    // throw Error(errorMessage);
  }

  private async executeCommand(
    action: EncryptionServiceActions,
    params: CommandParams,
    timeout?: number
  ): Promise<ShellCommandResponse> {
    const command = this.getCommand(action);
    const [code, stdout, stderr] = await shell.execute(
      command(params),
      [],
      false,
      timeout
    );
    return { code, stdout, stderr };
  }

  private getCommand(action: EncryptionServiceActions): CommandFunction {
    return this.commands.get([this.hostOS, action, this.name]);
  }

  public createDirectory(path: string) {
    fs.mkdirSync(path, {
      mode: 0o744,
      recursive: true,
    });
  }

  public deleteDirectory(path: string) {
    fs.rmdirSync(path, { maxRetries: 10, recursive: true });
  }

  public checkUserWritePermission(path: string): void {
    try {
      fs.accessSync(path, fs.constants.W_OK);
    } catch (error) {
      const message =
        "user does not seem to have write permisison on directory " +
        `${path} or it does not exist, resulted => ${error}`;
      log.debug(message);
      throw Error(message);
    }
  }
}
