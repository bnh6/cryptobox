import * as shell from "shelljs";
import {log} from "./LogUtil";
import * as constants from "./constants";

import * as path from "path";
import * as fs from "fs";
import * as os from "os";

// TODO: replace with https://www.npmjs.com/package/shelljs.exec
// INFO: https://github.com/shelljs/shelljs/wiki/Electron-compatibility
shell.config.execPath = shell.which("node").stdout;

export function execute(
  cmd: any,
  silent: boolean = false,
  failOnNonZeroReturn: boolean = true,
  timeout: number = 5000
) {
  log.debug(`executing command ${cmd}`);

  var result = shell.exec(cmd, { silent: silent, timeout: timeout });
  log.info(
    `the [${cmd}] exit with code [${result.code}], stdout:[${result.stdout}] and stderr:[${result.stderr}]`
  );

  if (failOnNonZeroReturn && result && result.code && 0 != result.code) {
    throw new Error(`The command returned non-zero code [${result.code}]`);
  }

  return [result.code, result.stdout, result.stderr];
}

export function getOS() {
  let platform: string = os.platform();

  if (!Object.values(constants.SUPPORTED_PLATFORM).includes(platform)) {
    log.error(`unsuported platform [${platform}]`);
    return null;
  } else {
    log.info(`running on [${platform}]`);
    return platform;
  }
}

export function checkOSSupport() {
  // https://nodejs.org/dist/latest-v5.x/docs/api/os.html#os_os_platform
  log.debug(`running on OS type [${os.type()}], release [${os.release()}]`);

  // if (constants.SUPPORTED_PLATFORM.indexOf(os.platform()) < 0) {
  //     log.error(`unsuported platform ${os.platform()}`)
  //     throw new Error(`unsuported platform ${os.platform()}`)
  // }
  // log.info(`platform supported ${os.platform()}`.green)

  // cheking ENCFS
  // var result = shell.which(constants.ENCFS)
  // if (result.code === 0)
  //     log.info(`found encfs at ${result.stdout}`)
  // else {
  //     log.debug(result)
  //     throw new Error("EncFS not found, please install")
  // }
}

export function checkDir(dir: string) {
  var fullpath = path.resolve(dir);
  log.debug(`absolute path: ${fullpath}`);

  if (!fs.existsSync(fullpath)) {
    log.debug(`directory [${fullpath}] does not exist, creating ...`);
    fs.mkdirSync(fullpath);
  }

  if (fs.statSync(fullpath).isDirectory()) {
    return fullpath;
  } else {
    log.error(`[${fullpath}] it is not a directory ...`);
    throw new Error(`[${fullpath}] is not a directory`);
  }
}

// module.exports = { checkOSSupport, getOS, execute, checkDir };
