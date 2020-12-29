import { ErrorsType } from "./errors-type";

export type AppError = {
  type: ErrorsType;
  message: string;
};
