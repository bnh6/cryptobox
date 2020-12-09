import { ServiceError } from "../../ServiceError";
import { Volume } from "../../../entities/Volume";
export default interface VolumeServiceWrapperInterface{
    getUNmountCommand(volume: Volume): string;
    getMountCommand(volume: Volume, password: String): string;
    getIsMountedCommand(volume: Volume): string;
    getIsVolumeOperationsSupportedCommand(): string;
    proccessErrorCode(code: number): ServiceError;

// eslint-disable-next-line semi
}