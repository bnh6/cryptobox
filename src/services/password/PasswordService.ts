import PasswordServiceError from "./PasswordError";

export interface PasswordService {
    savePassword(password: string, volume: string): void | never;
    deletePassword(volume: string): void | never;
    searchForPassword(volume: string): string | null | never;
    searchForCredentials(): string[] | never;
}
