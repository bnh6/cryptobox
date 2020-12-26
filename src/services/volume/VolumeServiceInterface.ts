import { Volume } from "../../entities/Volume";
import { VolumeEncryptionImpl } from "./wrappers/VolumeServiceWrapperFactory";

export default interface VolumeServiceInterface {
    mount(volume: Volume, password: string): void;
    unmount(volume: Volume): void;
    isMounted(volume: Volume): Promise<boolean>;
    isVolumeOperationsSupported(): boolean;
    createDirectory(path: string): void;
    deleteDirectory(path: string): void;
    mountUnmount(volume: Volume): void;
    supportedImplementations(): Promise<VolumeEncryptionImpl[]>;

    // eslint-disable-next-line semi
}