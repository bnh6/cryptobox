import { EncryptionServiceActions } from "../../types/encryption-service-actions";
import { ShellCommandResponse } from "../../types/shell-command-response";

export interface IErrorHandler {
  throwFromResponse(
    response: ShellCommandResponse,
    action: EncryptionServiceActions
  ): Error;
}
