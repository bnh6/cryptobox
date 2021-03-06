import { app, BrowserWindow } from "electron";
import * as path from "path";
import log from "./services/LogService";
import * as store from "./services/ConfigService";

// TODO th proccess env was missing /usr/local/bin, where encfs is...
process.env.PATH += ":/usr/local/bin";
log.debug("process path ", process.env.PATH);

log.debug(`config store ->${store}`);
// log.debug(store)

// https://github.com/electron/electron/issues/18397
app.allowRendererProcessReuse = true;

const isDev = process.argv0.includes("node_modules");
log.info(`isDev = ${isDev}`);
if (isDev) {
    // hot reload of web content
    require("electron-reload")(require("path").join(__dirname, "../static/"));
    // require('electron-reload')(__dirname);
    // require('electron-reload')(__dirname, {
    //   electron: require('electron')
    // });
}

// require("update-electron-app")({
//   repo: "bnh6/cryptobox",
//   updateInterval: "1 hour",
//   logger: log
// });

let mainWindow: BrowserWindow;

const icoPath = "./static/resources/elec.icns";

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 350,
        fullscreenable: false,
        resizable: true,
        icon: path.join(__dirname, icoPath),
        webPreferences: {
            // enableRemoteModule: true, // otherwise remote will undefined on renderers
            nodeIntegration: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.loadFile(path.join(__dirname, "../static/ui/volume.html"));

    const fs = require("fs");
    mainWindow.on("closed", function () {
        mainWindow = null;
    });

    mainWindow.on("unresponsive", function () {
        log.error("unresponsive, response to be implemented ...");
    });
}

app.on("ready", () => {
    loadScripts();
    createWindow();

    // enabled debug
    // mainWindow.webContents.openDevTools();
});

app.on("window-all-closed", function () {
    app.quit();
});

app.on("activate", function () {
    if (mainWindow === null) createWindow();
});

process.on("uncaughtException", function (error) {
    log.error("UNCATCH EXCEPTION FOUND ");
    log.error(error);
    app.quit();
});

function loadScripts() {
    import("./controllers/IPCManager");
}
