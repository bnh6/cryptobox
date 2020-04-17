const log = require("electron-log");
// import { log } from "electron-log";

const isDev = process.argv0.includes("node_modules")
if (isDev)
  log.transports.file.level = false;
else
  log.transports.file.level = true;


log.transports.console.format =
  "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

module.exports.log = log;
