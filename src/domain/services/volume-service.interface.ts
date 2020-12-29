import { Volume } from "../../entities/Volume";

export interface IVolumeService {
  mount(volume: Volume, password: string): void;
  unmount(volume: Volume): void;
  isMounted(volume: Volume): Promise<boolean>;
  createDirectory(path: string): void;
  deleteDirectory(path: string): void;

  // eslint-disable-next-line semi
}
