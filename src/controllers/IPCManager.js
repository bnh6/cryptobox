const { ipcMain } = require("electron");
const constants = require("../utils/constants");
var log = require("../utils/LogUtil").log;
var UIHelper = require("./UIHelper");

import { MountVolume } from "../applications/MountVolume"
import { Volume } from "../entities/Volume"

log.info("IPCManager loaded !")


ipcMain.on(constants.IPC_GET_DIRECTORY, (event, arg) => {
  log.info("IPC native directoy dialog ...")
  var directory = UIHelper.getDirectoryNatively();
  if (directory) {
    event.returnValue = directory[0];
  }
  else {
    event.returnValue = null;
  }
});


ipcMain.on(constants.IPC_MOUNT_UNMOUNT, (event, arg) => {
  var source = arg["source"];
  let volume = new Volume(source)

  log.info("IPC mount/umount")
  let mountApp = new MountVolume(volume)
  let resp = mountApp.mount();
  
  event.returnValue = resp;

});






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
