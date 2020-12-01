import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import { PasswordService } from "./PasswordService";
import PasswordServiceError from "./PasswordError";


export abstract class PasswordServiceBase implements PasswordService {

  abstract savePassword(password: Password, volume: Volume): void | PasswordServiceError;;

  abstract deletePassword(volume: Volume): void | PasswordServiceError;;

  abstract searchForPassword(volume: Volume): Password | null | PasswordServiceError;;

  abstract searchForCredentials(): string[] | PasswordServiceError;;

}
