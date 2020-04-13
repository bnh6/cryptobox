import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";

export interface PasswordService {
  retrievePasswordCommand(volume: Volume): string;
  saveNewPassword(password: Password, volume: Volume): void;
  deletePassword(volume: Volume): void;
  searchForPassword(volume: Volume): Password | null;
}
