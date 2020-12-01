import { Password } from "../../entities/Password";
import { Volume } from "../../entities/Volume";
import { PasswordService } from "./PasswordService";
import PasswordServiceError from "./PasswordError";


export abstract class PasswordServiceBase implements PasswordService {

    abstract savePassword(password: string, volume: string): void | never;;

    abstract deletePassword(volume: string): void | never;

    abstract searchForPassword(volume: string): string | null | never;;

    abstract searchForCredentials(): string[] | never;;

}
