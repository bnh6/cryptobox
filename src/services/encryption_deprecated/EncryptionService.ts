import { Volume } from "../../entities/Volume";

export interface EncryptionService {
    mount(volume: Volume, password: string): void;

    unmount(volume: Volume): void;

    isMounted(volume: Volume): boolean;
}
