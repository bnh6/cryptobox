import { ipcRenderer } from "electron";
import { constants } from "../utils/constants";
import log from "../services/LogService";
import Message from "../controllers/Message";

log.debug("volume-rendered starting ...");

const source = <HTMLInputElement>document.getElementById("source");
const cloudEncForm = <HTMLFormElement>document.getElementById("cloudEncForm");
const mountBtn = <HTMLButtonElement>document.getElementById("mountBtn");



source.onclick = () => {
    log.debug(
        `IPC source folder requesting a native directory browser -> ${constants.IPC_GET_DIRECTORY}`
    );
    const directory = ipcRenderer.sendSync(constants.IPC_GET_DIRECTORY, {});
    if (directory) {
        source.value = directory;
        checkIfPasswordExist(source.value);

        // in case the volume was left mounted ...
        updateMountBtn();
    }
};

cloudEncForm.onsubmit = () => {
    log.debug("form submit");
    const args = { source: source.value, };
    
    log.debug(`[RENDERER] requesting to mount/umount ${source.value}`);
    const result:Message = ipcRenderer.sendSync(constants.IPC_MOUNT_UNMOUNT, args);
    log.info(`[RENDERER] result= ${JSON.stringify(result)}`);

    // if (result.succeed) { updateMountBtn(); }
    updateMountBtn(); 

    ipcRenderer.sendSync(constants.IPC_NOTIFICATION, {
        message: result.message,
        error: !result.succeed,
    });
    return false; // to not reload the page
};

function updateMountBtn() {
    const result:Message = ipcRenderer.sendSync(constants.IPC_IS_MOUNTED, {
        source: source.value,
    });

    log.debug(`[RENDERER] updateMountBtn: ${JSON.stringify(result)}`);
    
    mountBtn.innerText = result.isMounted ? "UNmount" : "Mount";

    if (!result.succeed)
        ipcRenderer.sendSync(constants.IPC_NOTIFICATION, {
            message: result.message,
            error: !result.succeed,
        });
        
}

function checkIfPasswordExist(source: string): void {
    const result:Message = ipcRenderer.sendSync(constants.IPC_PASSWORD_EXIST, {
        source: source,
    });
    log.debug("[RENDERER] check if password exist", result);

    if (!result.succeed)
        ipcRenderer.sendSync(constants.IPC_NOTIFICATION, {
            message: result.message,
            error: !result.succeed,
        });
}

// function notify(message) {
//     const myNotification =
//         new window.Notification(constants.WINDOWS_TITLE, {
//             body: message,
//             silent: true,
//             icon: path.join(__dirname, "../../static/resources/cryptobox.png")
//         });

//     myNotification.onclick = () => {
//         console.log('Notification clicked')
//     }
// }
