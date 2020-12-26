export class ServiceError extends Error {
    // TODO ensure only the error from Enum will be raised
    constructor(m: ErrorType) {
        super(ErrorType[m]);
        this.name = "ServiceError";
    }

    public static errorFromCryFS(code: number): ServiceError{
        return new ServiceError(parseCryFSErrors(code));
    }

    public static errorFromEncFS(code: number): ServiceError{
        return new ServiceError(parseEncFSErrors(code));
    }
}

export enum ErrorType {
    // unhandled exception anywhere in the code, should not happen
    UnexpectedError,
    // Password is empty or invalid
    InvalidPassword,
    // provided passwword is not the correct one
    WrongPassword,
    // No VolumeEncryption present
    VolumeEncryptionNotSupported,


    // PasswordServiceError
    ErrorSavingPassword,
    ErrorDeletingPassword,
    ErrorSearchingPassword,

    ErrorToDetermineVolumeEncryptionSupport,

    UnsupportedOS,


}


function parseEncFSErrors(code: number): ErrorType {
    const CryFSErrorMap:Map<number, ErrorType> = new Map([
        [1, ErrorType.UnexpectedError], 
        [127, ErrorType.WrongPassword], 
    ]);

    if (!CryFSErrorMap.has(code))
        return CryFSErrorMap.get(1);//unknown error code
    else
        return CryFSErrorMap.get(code);
}



function parseCryFSErrors(code: number): ErrorType {
    const CryFSErrorMap:Map<number, ErrorType> = new Map([
        // An error happened that doesn't have an error code associated with it
        [1, ErrorType.UnexpectedError], //"UnspecifiedError" ],
        
        // The command line arguments are invalid.
        [10, ErrorType.UnexpectedError], //"InvalidArguments"],

        // // Couldn't load config file. Probably the password is wrong
        [11, ErrorType.WrongPassword], //"WrongPassword"],

        // // Password cannot be empty
        [12, ErrorType.WrongPassword], //"EmptyPassword"],

        // The file system format is too new for this CryFS version. Please update your CryFS version.
        [13, ErrorType.UnexpectedError], //"TooNewFilesystemFormat"],

        // The file system format is too old for this CryFS version. 
        // Run with --allow - filesystem - upgrade to upgrade it.
        [14, ErrorType.UnexpectedError], //"TooOldFilesystemFormat"],

        // The file system uses a different cipher than the one specified on the command line
        // using the--cipher argument.
        [13, ErrorType.UnexpectedError], //"WrongCipher"],

        // Base directory doesn't exist or is inaccessible (i.e. not read or writable or not a directory)
        [16, ErrorType.UnexpectedError], //"InaccessibleBaseDir"],

        // Mount directory doesn't exist or is inaccessible (i.e. not read or writable or not a directory)
        [17, ErrorType.UnexpectedError], //"InaccessibleMountDir"],

        // Base directory can't be a subdirectory of the mount directory
        [18, ErrorType.UnexpectedError], //"BaseDirInsideMountDir"],

        // Something's wrong with the file system.
        [19, ErrorType.UnexpectedError], //"InvalidFilesystem"],

        // The filesystem id in the config file is different to the last time we loaded 
        // a filesystem from this basedir. 
        // This could mean an attacker replaced the file system with a different one.
        // You can pass the--allow - replaced - filesystem option to allow this.
        [20, ErrorType.UnexpectedError], //"FilesystemIdChanged"],

        // The filesystem encryption key differs from the last time we loaded this filesystem. 
        // This could mean an attacker replaced the file system with a different one.
        // You can pass the--allow - replaced - filesystem option to allow this.
        [21, ErrorType.UnexpectedError], //"EncryptionKeyChanged"],

        // The command line options and the file system disagree on whether missing blocks 
        // should be treated as integrity violations.
        [22, ErrorType.UnexpectedError], //"FilesystemHasDifferentIntegritySetup"],

        // File system is in single-client mode and can only be used from the client that created it.
        [23, ErrorType.UnexpectedError], //"SingleClientFileSystem"],

        // A previous run of the file system detected an integrity violation. 
        // Preventing access to make sure the user notices.
        // The file system will be accessible again after the user deletes the integrity state file.
        [24, ErrorType.UnexpectedError], //"IntegrityViolationOnPreviousRun"],

        // An integrity violation was detected and the file system unmounted to make sure the user notices.
        [25, ErrorType.UnexpectedError], //"IntegrityViolation"]
    ]);

    if (!CryFSErrorMap.has(code))
        return CryFSErrorMap.get(1);//unknown error code
    else
        return CryFSErrorMap.get(code);
}



