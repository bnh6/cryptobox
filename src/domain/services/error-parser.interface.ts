import { AppError } from "../../types/app-error";
import { EncryptionServiceActions } from "../../types/encryption-service-actions";
import { ShellCommandResponse } from "../../types/shell-command-response";

export interface IErrorParser {
  parseFromResponse(
    response: ShellCommandResponse,
    action: EncryptionServiceActions
  ): Error;
}
