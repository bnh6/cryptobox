export enum ErrorsType {
  // unhandled exception anywhere in the code, should not happen
  UnexpectedError = "UnexpectedError",
  InvalidPassword = "InvalidPassword",
  WrongPassword = "WrongPassword",
  VersionError = "VersionError",
  VolumeEncryptionNotAvailable = "VolumeEncryptionNotAvailable",
  ErrorSavingPassword = "ErrorSavingPassword",
  ErrorDeletingPassword = "ErrorDeletingPassword",
  ErrorSearchingPassword = "ErrorSearchingPassword",
  ErrorToDetermineVolumeEncryptionSupport = "ErrorToDetermineVolumeEncryptionSupport",
  UnsupportedOS = "UnsupportedOS",
}
