import { Volume } from "../../../entities/Volume";
export default interface VolumeServiceWrapperInterface{
    getUNmountCommand(volume: Volume): string;
    getMountCommand(volume: Volume, password: String, unmountIdle: number): string;
    getIsMountedCommand(volume: Volume): string;
    getIsVolumeOperationsSupportedCommand(): string;

// eslint-disable-next-line semi
}