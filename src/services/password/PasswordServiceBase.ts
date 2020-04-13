import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import { PasswordService } from "./PasswordService";

export abstract class PasswordServiceBase implements PasswordService {
  abstract retrievePasswordCommand(volume: Volume): string;

  abstract saveNewPassword(password: Password, volume: Volume): void;

  abstract deletePassword(volume: Volume): void;

  abstract searchForPassword(volume: Volume): Password | null;
}
