import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";

export interface EncryptionService {
    mount(volume: Volume, password: Password): void;

    unmount(volume: Volume): void;

    isMounted(volume: Volume): boolean;
}
