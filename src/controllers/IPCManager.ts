import { ipcMain } from "electron";
import { constants } from "../utils/constants";
import log from "../utils/LogUtil";
import * as UIHelper from "./UIHelper";
import PasswordService from "../services/PasswordService";

import { MountVolume } from "../applications/MountVolume";
import { Volume } from "../entities/Volume";

log.info("IPCManager loaded !");

ipcMain.on(constants.IPC_GET_DIRECTORY, (event) => {
    log.info("[IPC_MAIN] native directoy dialog ...");
    const directory = UIHelper.getDirectoryNatively();
    if (directory) {
        event.returnValue = directory[0];
    } else {
        event.returnValue = null;
    }
});

ipcMain.on(constants.IPC_MOUNT_UNMOUNT, (event, arg) => {
    const source = arg["source"];
    log.info(`[IPC_MAIN] mount/umount for  "${source}"`);

    const volume = new Volume(source);

    log.info("IPC mount/umount");
    const mountApp = new MountVolume(volume);
    event.returnValue = mountApp.mount();
});

ipcMain.on(constants.IPC_IS_MOUNTED, (event, arg) => {
    const source = arg["source"];
    log.info(`[IPC_MAIN] isMounted for  "${source}"`);
    const volume = new Volume(source);

    const mountApp = new MountVolume(volume);
    event.returnValue = mountApp.isMount();
});

ipcMain.on(constants.IPC_SAVE_PASSWOD, async (event, arg) => {
    const source = arg["source"];
    const password = arg["password"];
    // TODO validate parameters
    log.info(`[IPC_MAIN] mount/umount for  "${source}"`);

    const volume = new Volume(source);

    //TODO trycatch and async
    const passwordservice = new PasswordService();
    await passwordservice.savePassword(password, volume);

    event.returnValue = "success";
});

ipcMain.on(constants.IPC_PASSWORD_EXIST, async (event, arg) => {
    const source = arg["source"];
    log.info(`[IPC_MAIN] password exists for "${source}"`);
    const volume = new Volume(source);

    //TODO trycatch and async
    const passwordservice = new PasswordService();
    const passwordExists = await passwordservice.passwordExist(volume);
    if (!passwordExists) {
        UIHelper.passwordPrompt(volume);
    }

    event.returnValue = "success";
});

ipcMain.on(constants.IPC_NOTIFICATION, (event, arg) => {
    const message = arg["message"];
    log.info(`[IPC_MAIN] notification "${message}"`);

    UIHelper.notify(message);

    event.returnValue = "success";
});

// UIHelper.passwordPrompt( new Volume("/tmp/testfdd /sdf"));

// ipcMain.on(constants.IPC_ACCT_EXISTS, (event, arg) => {
//   var source = arg["source"];
//   log.info(`checking if password exists for source folder: [${source}]`);

//   if (!source || source === "") {
//     log.error(`missing source folder [${source}]`.red);
//   }

//   let password = null;

//   if (os.platform() === "darwin") {
//     var pm = new PasswordManager(source);
//     password = pm.searchForPassword();
//   } else if (os.platform() === "linux") {
//     password = "12345"; // forced password while Linux password manager is not defined
//   }

//   if (password) {
//     event.returnValue = !!UIHelper.confirmPasswordUse();
//   } else {
//     log.info(`password not found for ${source}`);
//     event.returnValue = false;
//     // TODO create password
//   }
// });

// ipcMain.on(constants.IPC_IS_MOUNTED, (event, arg) => {
//   var destination = arg["destination"];
//   log.info(`check if ${destination} is mounted`);

//   const encryptionManager = encryptionManagerFactory.create();
//   var mounted = encryptionManager.isMounted(destination);
//   if (mounted) event.returnValue = true;
//   else event.returnValue = false;
// });

// ipcMain.on(constants.IPC_MOUNT_UNMOUNT, (event, arg) => {
//   var source = arg["source"];
//   var destination = arg["destination"];
//   var volumeName = arg["volumeName"];

//   log.info(
//     `mount/unmount on source: [${source}], destination: [${destination}], volumenName: [${volumeName}]`
//   );

//   //   var encMngr = new EncryptionManager();
//   const encMngr = encryptionManagerFactory.create();

//   if (!encMngr.isMounted(destination)) {
//     log.log(`{destination} is not mounted, mounting`);
//     encMngr.mount(source, destination, volumeName);
//     log.log(`${source} -> ${destination} mounted with success`);
//     event.returnValue = "Mounted";
//   } else {
//     log.log(`${destination} is  mounted, umounting`);
//     encMngr.unmount(destination);
//     log.log(`${destination} unounted with success`);
//     event.returnValue = "Unmounted";
//   }
// });
