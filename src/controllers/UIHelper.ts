import { Volume } from "../entities/Volume";

import { dialog, BrowserWindow, Notification } from "electron";
import * as path from "path";
import { constants } from "../utils/constants";
import log from "../services/LogService";

export function notify(message: string, error: boolean = false) {
    log.debug("is notification supported ", Notification.isSupported()); // TODO do something when is not

    let title = constants.WINDOWS_TITLE;
    if (error) { title = ">> ERROR << - " + title; }

    const myNotification = new Notification({
        title: title,
        // subtitle: "testing subtitle",
        body: message,
        silent: true,
        icon: path.join(__dirname, "../../static/resources/cryptobox.png"),
    });

    myNotification.show();

    // myNotification.onclick = () => {
    //     console.log('Notification clicked')
    // }
}

export function getDirectoryNatively() {
    const directory = dialog.showOpenDialogSync({ properties: ["openDirectory"] });
    log.info(`getDirectoryNatively result: [${directory}]`);
    return directory;
}

export function passwordPrompt(volume: Volume) {
    log.debug("rendering password prompt modal...");
    const activeWindow = BrowserWindow.getAllWindows()[0]; // TODO will fail if there is more than one window
    console.log(activeWindow.getSize());

    let promptWindow = new BrowserWindow({
        width: activeWindow.getSize()[0] * 0.8,
        height: activeWindow.getSize()[1] * 0.9,
        parent: activeWindow,
        show: false,
        modal: true, // disable for a floating popup
        alwaysOnTop: true,
        title: "Provide a Password...",
        autoHideMenuBar: true,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            sandbox: false,
            additionalArguments: [volume.encryptedFolderPath],
        },
    });

    // runs after the IPC, so it can return.
    promptWindow.on("closed", () => {
        promptWindow = null;
    });

    // enable debug
    // promptWindow.webContents.openDevTools();

    // Load the HTML dialog box
    promptWindow.loadFile(path.join(__dirname, "../../static/ui/password.html"), {
        query: { source: volume.encryptedFolderPath },
    });
    promptWindow.once("ready-to-show", () => {
        log.debug("password prompt ready to show ...");
        promptWindow.show();
    });
}
