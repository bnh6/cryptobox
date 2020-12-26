import { ErrorType, ServiceError } from "../ServiceError";
import * as shell from "../ShellService";
import log from "../LogService";


/**
 * 
 * on OSX:
 *  - requires restart or run
 *      sudo /Library/Filesystems/osxfuse.fs/Contents/Resources/load_osxfuse
 */

async function homebrew() {
    await shell.ifNotInstalledInstall(
        "homebrew",
        "brew --version",
        "/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"");
}

async function osxfuse() {
    await shell.ifNotInstalledInstall(
        "osxfuse",
        "pkgutil --pkgs | grep -i osxfuse1",
        "brew install --cask osxfuse");
}

async function cryfs() {
    await homebrew();
    await osxfuse();
    await shell.ifNotInstalledInstall(
        "cryfs",
        "cryfs --verion",
        "brew install cryfs");
}

async function encfs() {
    await homebrew();
    await osxfuse();
    await shell.ifNotInstalledInstall(
        "cryfs",
        "cryfs --verion",
        "brew install cryfs");
}

export async function install() {
    try {
        await homebrew();
        await osxfuse();
        await cryfs();
        await encfs();
    } catch (error) {
        if (error instanceof ServiceError) throw error;
        log.error(`Error to install implementations on OSX, ${error}`);
        throw new ServiceError(ErrorType.ErrorToInstallImplementations);
    }
}