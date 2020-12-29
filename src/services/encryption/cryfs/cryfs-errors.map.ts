import { AppError } from "../../../types/app-error";
import { ErrorsType } from "../../../types/errors-type";

export const CryFSErrorMap: Map<number, AppError> = new Map([
  [
    1,
    {
      type: ErrorsType.UnexpectedError, //"UnspecifiedError"
      message:
        "An error happened that doesn't have an error code associated with it",
    },
  ],
  [
    10,
    {
      type: ErrorsType.UnexpectedError, //"InvalidArguments"],
      message: "The command line arguments are invalid.",
    },
  ],
  [
    11,
    {
      type: ErrorsType.WrongPassword,
      message: "Couldn't load config file. Check password and try again",
    },
  ],
  [
    12,
    {
      type: ErrorsType.WrongPassword,
      message: "Password cannot be empty",
    },
  ],
  [
    13,
    {
      type: ErrorsType.VersionError,
      message:
        "The file system format is too new for this CryFS version. Please update your CryFS version.",
    },
  ],
  [
    14,
    {
      type: ErrorsType.VersionError,
      message:
        "The file system format is too old for this CryFS version. Run with --allow - filesystem - upgrade to upgrade it.",
    },
  ],
  [
    13, //TODO: Check if is the right code it is the same as a VersionError
    {
      type: ErrorsType.UnexpectedError, //"WrongCipher"],
      message:
        "The file system uses a different cipher than the one specified on the command line using the --cipher argument.",
    },
  ],
  [
    16,
    {
      type: ErrorsType.InaccessibleBaseDir,
      message:
        "Base directory doesn't exist or is inaccessible (i.e. not read or writable or not a directory).",
    },
  ],
  [
    17,
    {
      type: ErrorsType.InaccessibleMountDir,
      message:
        "Mount directory doesn't exist or is inaccessible (i.e. not read or writable or not a directory)",
    },
  ],
  [
    18,
    {
      type: ErrorsType.BaseDirInsideMountDir,
      message: "Base directory can't be a subdirectory of the mount directory",
    },
  ],
  [
    19,
    {
      type: ErrorsType.InvalidFileSystem,
      message: "Something's wrong with the file system.",
    },
  ],
  [
    20,
    {
      type: ErrorsType.FileSystemIdChanged,
      message: `The filesystem id in the config file is different to the last time a filesystem was loaded from this basedir.
               This could mean an attacker replaced the file system with a different one.
               You can pass the --allow -replaced -filesystem option to allow this.`,
    },
  ],
  [
    21,
    {
      type: ErrorsType.EncryptionKeyChanged,
      message: `The filesystem encryption key differs from the last time we loaded this filesystem.
               This could mean an attacker replaced the file system with a different one.
               You can pass the--allow -replaced - filesystem option to allow this.`,
    },
  ],
]);

//   // The command line options and the file system disagree on whether missing blocks
//   // should be treated as integrity violations.
//   [22, ErrorsType.UnexpectedError], //"FilesystemHasDifferentIntegritySetup"],

//   // File system is in single-client mode and can only be used from the client that created it.
//   [23, ErrorsType.UnexpectedError], //"SingleClientFileSystem"],

//   // A previous run of the file system detected an integrity violation.
//   // Preventing access to make sure the user notices.
//   // The file system will be accessible again after the user deletes the integrity state file.
//   [24, ErrorsType.UnexpectedError], //"IntegrityViolationOnPreviousRun"],

//   // An integrity violation was detected and the file system unmounted to make sure the user notices.
//   [25, ErrorsType.UnexpectedError], //"IntegrityViolation"]
