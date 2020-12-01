import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import PasswordServiceError from "./PasswordError";

export interface PasswordService {
  savePassword(password: Password, volume: Volume): void | PasswordServiceError;

  deletePassword(volume: Volume): void | PasswordServiceError;

  searchForPassword(volume: Volume): Password | null |PasswordServiceError;

  searchForCredentials(): string[] | PasswordServiceError;
}
