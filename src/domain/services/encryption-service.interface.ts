import { CommandFunction } from "../../types/command";
import { EncryptionServiceActions } from "../../types/encryption-service-actions";

export interface EncryptionService {
  getCommand(action: EncryptionServiceActions): CommandFunction;
  checkIfIsAvailable(): void;
}
