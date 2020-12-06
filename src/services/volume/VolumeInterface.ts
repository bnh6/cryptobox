import { Volume } from "../../entities/Volume";

export default interface VolumeServiceInterface {
    mount(volume: Volume, password: string, umountIdle: number): void;
    unmount(volume: Volume): void;
    isMounted(volume: Volume): Promise<boolean>;
    isVolumeOperationsSupported(): boolean;
    createDirectory(path: string): void;
    deleteDirectory(path: string): void;
}