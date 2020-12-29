import { AppError } from "../types/app-error";
import { EncryptionServiceActions } from "../types/encryption-service-actions";
import { ShellCommandResponse } from "../types/shell-command-response";

export class CustomError extends Error {
  constructor(
    error: AppError,
    action: EncryptionServiceActions,
    response: ShellCommandResponse
  ) {
    const { code, stdout, stderr } = response;
    super(
      `type: ${error.type} | message:${error.message} | action: ${action} | shellResponse: code=${code} stdout=${stdout}, stderr=${stderr}`
    );
    this.name = "CustomError";
  }
}
