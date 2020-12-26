import * as os from "os";
import log from "../LogService";
import { ErrorType, ServiceError } from "../ServiceError";
import * as shell from "../ShellService";


/**
 * notes
 * on linux:
 *   - requires sudo
 * 
 */

async function encfs() {
    await shell.ifNotInstalledInstall(
        "cryfs",
        "cryfs --verion",
        "sudo apt install encfs -y");
}

async function cryfs() {
    await shell.ifNotInstalledInstall(
        "cryfs",
        "cryfs --verion",
        "sudo apt install cryfs -y");
}

export async function install() {
    try {
        await cryfs();
        await encfs();
    } catch (error) {
        if (error instanceof ServiceError) throw error;
        log.error(`Error to install implementations on LINUX, ${error}`);
        throw new ServiceError(ErrorType.ErrorToInstallImplementations);
    }
}