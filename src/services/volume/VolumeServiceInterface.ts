import { Volume } from "../../entities/Volume";

export default interface VolumeServiceInterface {
    mount(volume: Volume, password: string): void;
    unmount(volume: Volume): void;
    isMounted(volume: Volume): Promise<boolean>;
    isVolumeOperationsSupported(): boolean;
    createDirectory(path: string): void;
    deleteDirectory(path: string): void;
    mountUnmount(volume: Volume): void;

    // eslint-disable-next-line semi
}