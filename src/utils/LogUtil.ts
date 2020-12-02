import log from "electron-log";

const isDev = process.argv0.includes("node_modules");
if (isDev) {
    log.transports.file.level = (isDev ? false : "debug");
}


log.transports.console.format =
    "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

export default log;
