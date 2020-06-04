import { ipcRenderer } from "electron";
import { constants } from "../utils/constants";
import log from "../utils/LogUtil";

log.debug("volume-rendered starting ...");

let source = <HTMLInputElement>document.getElementById("source");
let cloudEncForm = <HTMLFormElement>document.getElementById("cloudEncForm");
let mountBtn = <HTMLButtonElement>document.getElementById("mountBtn");

source.onclick = () => {
  log.debug(
    `IPC source folder requesting a native directory browser -> ${constants.IPC_GET_DIRECTORY}`
  );
  const directory = ipcRenderer.sendSync(constants.IPC_GET_DIRECTORY, {});
  if (directory) {
    source.value = directory;
    checkIfPasswordExist(source.value);
    updateMountBtn();
  }
};

cloudEncForm.onsubmit = () => {
  log.debug("form submit");
  const args = {
    source: source.value,
  };
  log.debug(`IPC requesting to mount/umount ${source.value}`);
  const response = ipcRenderer.sendSync(constants.IPC_MOUNT_UNMOUNT, args);
  log.info(`IPC here is the result ${JSON.stringify(response)}`);
  updateMountBtn();

  // notify(response.message)
  ipcRenderer.sendSync(constants.IPC_NOTIFICATION, {
    message: response.message,
  });

  return false;
};

function updateMountBtn() {
  const response = ipcRenderer.sendSync(constants.IPC_IS_MOUNTED, {
    source: source.value,
  });
  mountBtn.innerText = response.isMounted ? "UNmount" : "Mount";
}

function checkIfPasswordExist(source: string): void {
  const response = ipcRenderer.sendSync(constants.IPC_PASSWORD_EXIST, {
    source: source,
  });
  log.debug("IPC check if password exist", response);
}

// function notify(message) {
//     const myNotification =
//         new window.Notification(constants.WINDOWS_TITLE, {
//             body: message,
//             silent: true,
//             icon: path.join(__dirname, "../../static/resources/cloud-enc.png")
//         });

//     myNotification.onclick = () => {
//         console.log('Notification clicked')
//     }
// }
