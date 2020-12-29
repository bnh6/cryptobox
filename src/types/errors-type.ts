export enum ErrorsType {
  // unhandled exception anywhere in the code, should not happen
  UnexpectedError = "UnexpectedError",
  InvalidPassword = "InvalidPassword",
  WrongPassword = "WrongPassword",
  VersionError = "VersionError",
  InaccessibleBaseDir = "InaccessibleBaseDir",
  InaccessibleMountDir = "InaccessibleMountDir",
  BaseDirInsideMountDir = "BaseDirInsideMountDir",
  InvalidFileSystem = "InvalidFileSystem",
  FileSystemIdChanged = "FileSystemIdChanged",
  VolumeEncryptionNotAvailable = "VolumeEncryptionNotAvailable",
  ErrorSavingPassword = "ErrorSavingPassword",
  ErrorDeletingPassword = "ErrorDeletingPassword",
  ErrorSearchingPassword = "ErrorSearchingPassword",
  ErrorToDetermineVolumeEncryptionSupport = "ErrorToDetermineVolumeEncryptionSupport",
  UnsupportedOS = "UnsupportedOS",
}
