import { SupportedEncryptionServices } from "./supported-encryption-services";
import { EncryptionServiceActions } from "./encryption-service-actions";
import { Volume } from "../entities/Volume";

export type CommandParams = {
  volume?: Volume;
  password?: string;
};

export type CommandFunction = (params: CommandParams) => string;

export type Command = {
  os: NodeJS.Platform;
  action: EncryptionServiceActions;
  encryptionService: SupportedEncryptionServices;
  command: CommandFunction;
};
