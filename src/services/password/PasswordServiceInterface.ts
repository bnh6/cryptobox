import PasswordServiceError from "./PasswordError";
import { Volume } from "../../entities/Volume";

interface PasswordService {

    savePassword(password: string, volume: Volume): void;
    deletePassword(volume: Volume): void;
    searchForPassword(volume: Volume): Promise<string>;
    passwordExist(volume: Volume): Promise<boolean>;

}
export default PasswordService;
