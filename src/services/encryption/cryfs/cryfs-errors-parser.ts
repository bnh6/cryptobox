import { ErrorParser } from "../../../domain/services/error-parser.interface";
import { AppError } from "../../../types/app-error";
import { ShellCommandResponse } from "../../../types/shell-command-response";
import { CryFSErrorMap } from "./cryfs-errors.map";

export class CryFSErrorsParser implements ErrorParser {
  constructor(
    private readonly errorsMap: Map<number, AppError> = CryFSErrorMap
  ) {}

  public parseFromResponse(response: ShellCommandResponse): AppError {
    return this.errorsMap.has(response.code)
      ? this.errorsMap.get(response.code)
      : this.errorsMap.get(1);
  }
}
