import { IErrorHandler } from "../domain/services/error-handler.interface";
import { AppError } from "../types/app-error";
import { EncryptionServiceActions } from "../types/encryption-service-actions";
import { ShellCommandResponse } from "../types/shell-command-response";
import log from "../utils/LogUtil";
import { CustomError } from "./custom-error";

export class ErrorsHandler implements IErrorHandler {
  constructor(private readonly errorsMap: Map<number, AppError>) {}

  public throwFromResponse(
    response: ShellCommandResponse,
    action: EncryptionServiceActions
  ): CustomError {
    const error: AppError = this.errorsMap.has(response.code)
      ? this.errorsMap.get(response.code)
      : this.errorsMap.get(1);

    log.error(error.message);
    throw new CustomError(error, action, response);
  }
}
