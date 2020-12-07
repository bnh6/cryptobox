import VolumeServiceWrapperCryFS from "./VolumeServiceWrapperCryFS";
import VolumeWrapperServiceEncFS from "./VolumeServiceWrapperEncFS";
import VolumeWrapperInterface from "./VolumeServiceWrapperInterface";
import{ ServiceError, ErrorType }  from "../../ServiceError";
import * as os from "os";

export enum VolumeEncryptionImpl{
    EncFS,
    CryFS,
}

export class VolumeServiceWrapperFactory {
    public static create(implementation: VolumeEncryptionImpl): VolumeWrapperInterface {
        switch (implementation) {
        case VolumeEncryptionImpl.CryFS: return new VolumeServiceWrapperCryFS();
        case VolumeEncryptionImpl.EncFS: return new VolumeWrapperServiceEncFS();
        default: throw new ServiceError(ErrorType.UnsupportedOS);
        }
    }
}