/* eslint-disable max-len */
import log from "../LogService";
import { ErrorType, ServiceError } from "../ServiceError";
import * as shell from "../ShellService";


/**
 * consider install with cholocatey
 * https://chocolatey.org/install
 * 
 * 
 */

async function chocolatey() {
    // eslint-disable-next-line quotes
    const cmdCommand = `@"%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "[System.Net.ServicePointManager]::SecurityProtocol = 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\\chocolatey\\bin"`;
    
    //  Run Get-ExecutionPolicy. If it returns Restricted, then run Set-ExecutionPolicy AllSigned or Set-ExecutionPolicy Bypass -Scope Process.
    // eslint-disable-next-line quotes
    const powershellCommand = `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))`;
   
   
    await shell.ifNotInstalledInstall(
        "cholocatey",
        "choco -?",
        cmdCommand);
    
    // "curl.exe --output dokan64.msi --location  \
    //     --url https://github.com/dokan-dev/dokany/releases/latest/download/Dokan_x64.msi && \
    //     start /wait msiexec.exe /I dokan64.msi /quiet /qn /norestart /L*V \"dokan.log\" ");
}


async function dokany() {
    await shell.ifNotInstalledInstall(
        "dokany",
        "if exists \"C:\\Windows\\System32\\drivers\\dokan1.sys\" (exit /b 0) else (exit /b 1)",
        "choco install -y dokany");
    
    // "curl.exe --output dokan64.msi --location  \
    //     --url https://github.com/dokan-dev/dokany/releases/latest/download/Dokan_x64.msi && \
    //     start /wait msiexec.exe /I dokan64.msi /quiet /qn /norestart /L*V \"dokan.log\" ");
}

async function vcpp() {
    await shell.ifNotInstalledInstall(
        "visual c++",
        "Get-WmiObject -Class Win32_Product -Filter \"Name LIKE '%Visual C++ 2017%'\"",
        "choco install vcredist2017");
    
    // "curl.exe --output vc_redist.x64.exe --location --url https://aka.ms/vs/16/release/vc_redist.x64.exe \
    //     && start /wait msiexec.exe /I vc_redist.x64.exe /quiet /qn /norestart /L*V \"vc.log\" ");
}
async function cryfs() {
    await shell.ifNotInstalledInstall(
        "cryfs",
        "cryfs --verion",
        "curl.exe --output cryfs64.msi --location --url https://github.com/cryfs/cryfs/releases/download/0.10.2/cryfs-0.10.2-win64.msi \
            && start /wait msiexec.exe /I cryfs64.msi /quiet /qn /norestart /L*V \"cryfs.log\"");
}
async function encfs() {
    await shell.ifNotInstalledInstall(
        "cryfs",
        "cryfs --verion",
        "choco install encfs4win --pre");
}


export async function install() {
    try {
        await chocolatey();
        await vcpp();
        await dokany();
        await cryfs();
        await encfs();
    } catch (error) {
        if (error instanceof ServiceError) throw error;
        log.error(`Error to install implementations on WINDOWS, ${error}`);
        throw new ServiceError(ErrorType.ErrorToInstallImplementations);
    }
}