import { ipcMain } from "electron";
import { constants } from "../utils/constants";
import log from "../services/LogService";
import * as UIHelper from "./UIHelper";
import PasswordService from "../services/password/PasswordService";
import { ServiceError, ErrorType } from "../services/ServiceError";
import VolumeService from "../services/volume/VolumeService";
import { Volume } from "../entities/Volume";
import Message from "./Message";


log.info("IPCManager loaded !");



/**
 * opens a native dialogue to choose the directory, not all directories are available.
 * returns a string representing the fullpath (directory)
 */
ipcMain.on(constants.IPC_GET_DIRECTORY, (event) => {
    log.info("[IPC_MAIN] native directoy dialog ...");

    const directory = UIHelper.getDirectoryNatively();
    if (directory) {
        event.returnValue = directory[0];
    } else {
        event.returnValue = null;
    }
});


/**
 * takes a source folder and mount/unmount the directory.
 * expects the password to exist for the directory
 * returns a Message
 */
ipcMain.on(constants.IPC_MOUNT_UNMOUNT, async (event, arg) => {
    const msg = new Message();
    const volume = new Volume(arg["source"]);
    const passwordservice = new PasswordService();

    log.info(`[IPC_MAIN] mount/umount for  "${volume.getVolumeAlias()}"`);

    try {
        if (!passwordservice.passwordExist(volume)) {
            msg.succeed = false;
            msg.message = `try again when there is a password for ${volume.encryptedFolderPath}`;
            event.returnValue = msg;
        } else {
            const volumeService = new VolumeService();
            const wasMonted = await volumeService.isMounted(volume);
            log.info(`${volume} is already mounted? = ${wasMonted}`);

            await volumeService.mountUnmount(volume);

            // do we need have separated messages?
            if (wasMonted) msg.message = "unmounted with success";
            else msg.message = "mounted with success";

            msg.isMounted = await volumeService.isMounted(volume);
            msg.succeed = true;
        }
    } catch (error) {
        msg.succeed = false;
        if (error instanceof ServiceError) {
            msg.message = error.message;
        } else {
            log.error(`[IPC_MAIN] Generic error during mount/unmount => ${error}`);
            msg.message = ErrorType.UnexpectedError.toString();
        }
    }
    event.returnValue = msg;
});



/**
 * tell if a source folder it is already mounted
 * returns Message
 */
ipcMain.on(constants.IPC_IS_MOUNTED, async (event, arg) => {
    const msg = new Message();
    const volume = new Volume(arg["source"]);
    
    log.info(`[IPC_MAIN] isMounted for  "${volume.getVolumeAlias()}"`);
    
    try {
        const volumeService = new VolumeService();
        msg.isMounted = await volumeService.isMounted(volume);
        msg.succeed = true;
    
    } catch (error) {
        msg.succeed = false;
        if (error instanceof ServiceError) {
            msg.message = error.message;
        } else {
            log.error(`[IPC_MAIN] Generic error during isMounted => ${error}`);
            msg.message = ErrorType.UnexpectedError.toString();
        }
    }
    event.returnValue = msg;
});




/**
 * Saves a password for a given folder
 * returns a Message
 */
ipcMain.on(constants.IPC_SAVE_PASSWOD, async (event, arg) => {
    const msg = new Message();
    const volume = new Volume(arg["source"]);
    const password = arg["password"];
    const passwordservice = new PasswordService();

    log.info(`[IPC_MAIN] saving passowrd for  "${volume.getVolumeAlias()}"`);

    try {
        await passwordservice.savePassword(password, volume);
        msg.succeed = true;
    } catch (error) {
        msg.succeed = false;
        if (error instanceof ServiceError) {
            msg.message = error.message;
        } else {
            log.error(`[IPC_MAIN] Generic error saving password => ${error}`);
            msg.message = ErrorType.UnexpectedError.toString();
        }
    }
    event.returnValue = msg;
});



/**
 * if password does not exist, prompt and save one
 * returns a Message
 */
ipcMain.on(constants.IPC_PASSWORD_EXIST, async (event, arg) => {
    const msg = new Message();
    const volume = new Volume(arg["source"]);
    const passwordservice = new PasswordService();

    log.info(`[IPC_MAIN] password exists for "${volume.getVolumeAlias()}"`);

    try {
        const passwordExists = await passwordservice.passwordExist(volume);
        if (!passwordExists) { UIHelper.passwordPrompt(volume); }
        msg.succeed = true;
    } catch (error) {
        msg.succeed = false;
        if (error instanceof ServiceError) {
            msg.message = error.message;
        } else {
            log.error(`[IPC_MAIN] Generic error saving password => ${error}`);
            msg.message = ErrorType.UnexpectedError.toString();
        }
    }
    event.returnValue = msg;
});



ipcMain.on(constants.IPC_NOTIFICATION, (event, arg) => {
    const message = arg["message"];
    log.info(`[IPC_MAIN] notification "${message}"`);

    UIHelper.notify(message);

    event.returnValue = "success";
});