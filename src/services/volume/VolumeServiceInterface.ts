import { Volume } from "../../entities/Volume";

export default interface VolumeServiceInterface {
  mount(volume: Volume, password: string): void;
  unmount(volume: Volume): void;
  isMounted(volume: Volume): Promise<boolean>;
  isVolumeOperationsSupported(): boolean;
  createDirectory(path: string): void;
  deleteDirectory(path: string): void;

  // eslint-disable-next-line semi
}

abstract class VolumeService {
  abstract mount(volume: Volume, password: string): Promise<void>;
  abstract unmount(volume: Volume): Promise<void>;
  abstract isMounted(volume: Volume): Promise<boolean>;
  createDirectory(path: string): void {}
  deleteDirectory(path: string): void {}
}
