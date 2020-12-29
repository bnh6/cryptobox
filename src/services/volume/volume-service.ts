import { EncryptionService } from "../../domain/services/encryption-service.interface";
import { IVolumeService } from "../../domain/services/volume-service.interface";
import { Volume } from "../../entities/Volume";
import { EncryptionServiceActions } from "../../types/encryption-service-actions";
import log from "../../utils/LogUtil";
import * as shell from "../../utils/ShellUtil";
import * as fs from "fs";

export abstract class VolumeService {
  abstract mount(volume: Volume, password: string): Promise<void>;
  abstract unmount(volume: Volume): Promise<void>;
  abstract isMounted(volume: Volume): Promise<boolean>;

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
        "user does not seem to have writing permisison on directory " +
        `${path} or it does not exist, resulted => ${error}`;
      log.debug(message);
      throw Error(message);
    }
  }
}
