import log from "electron-log";

const isDev = process.argv0.includes("node_modules");
if (isDev) {
    log.transports.file.level = (isDev ? false : "debug");
}

// LOG directories
// on Linux: ~/.config/{app name}/logs/{process type}.log
// on macOS: ~/Library/Logs/{app name}/{process type}.log
// on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log


log.transports.console.format =
    "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

export default log;
