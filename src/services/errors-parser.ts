import { IErrorParser } from "../domain/services/error-parser.interface";
import { AppError } from "../types/app-error";
import { EncryptionServiceActions } from "../types/encryption-service-actions";
import { ShellCommandResponse } from "../types/shell-command-response";

export class ErrorsParser implements IErrorParser {
  constructor(private readonly errorsMap: Map<number, AppError>) {}

  public parseFromResponse(
    response: ShellCommandResponse,
    action: EncryptionServiceActions
  ): Error {
    const { code, stdout, stderr } = response;

    const error: AppError = this.errorsMap.has(response.code)
      ? this.errorsMap.get(response.code)
      : this.errorsMap.get(1);

    return Error(
      `type: ${error.type} | message:${error.message} | action: ${action}  | shellResponse: code=${code} stdout=${stdout}, stderr=${stderr}`
    );
  }
}
