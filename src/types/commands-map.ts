import { EncryptionServiceActions } from "./encryption-service-actions";
import { CommandFunction } from "./command";
import { SupportedEncryptionServices } from "./supported-encryption-services";

export type CommandsMap = Map<
  [NodeJS.Platform, EncryptionServiceActions, SupportedEncryptionServices],
  CommandFunction
>;
