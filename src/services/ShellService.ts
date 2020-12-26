import log from "./LogService";
import { spawnSync } from "child_process"; // since node 12
import { ErrorType, ServiceError } from "./ServiceError";

// https://nodejs.org/api/child_process.html#child_process_child_process_spawnsync_command_args_options
export function execute(
    command: string,
    args: string[] = [],
    failOnNonZeroReturn: boolean = true,
    timeout: number = 7000
): [number, string, string] {
    
    const result = spawnSync(command, args, {
        timeout,
        shell: true,
        windowsHide: true,
    });

    // TODO handle error better
    if (result && result.error) {
        
        // // cropping stderr and stdout, cause sometimes it throws endless garbage
        // // remember that commands may contain sensitive information ...
        // log.error(`Suffered an error to execute the command [${command}], 
        // code=${result.status},
        // stdout[0-256]=[${result.stdout.subarray(0, 256)}],
        // stderr[0-256]=[${result.stderr.subarray(0, 256)}],
        // error = [${result.error}]`);
        // throw new ServiceError(ErrorType.UnexpectedError);
    }

    if (failOnNonZeroReturn && result && result.status && 0 !== result.status) {
        throw new Error(`The command returned non-zero code [${result.status}]`);
    }

    // remember that commands may contain sensitive information ...
    const isDev = process.argv0.includes("node_modules");
    log.info(`isDev = ${isDev}`);
    log.debug(
        `  => [${result.status}] -- executing command [${command}] [${args}], failOnNon0=${failOnNonZeroReturn}, \
        stdout ${result.stdout.toString()}, stderr=[${result.stderr.toString()}]`
    );

    return [result.status, result.stdout.toString(), result.stderr.toString()];
}


export async function ifNotInstalledInstall(appName: string,
    appVersionCmd: string, appInstallCmd: string) {
    // checking if installed
    let [code, stdout, stderr] = await this.execute(appVersionCmd, [], false);
    if (code === 0) {
        log.info(`${appName} is installed, code = ${code}, stdout=[${stdout}]`);
        return;

    // not installed, trying to install.
    } else if (code === 127) { // TODO will this work on Windows as well.
        log.info(`${appName} does not seem to be installed installed, \
            code = ${code}, stdout=[${stdout}]`);
        
        [code, stdout, stderr] = await this.execute(appInstallCmd, [], false);
        if (code !== 0) {
            log.error(`error to install ${appName} , \
                code=${code} stdout=${stdout}, stderr=${stderr}`);
            throw new ServiceError(ErrorType.ErrorToInstallImplementations);
        }

        log.info(`${appName} was installed with success, \
            code = ${code}, stdout=[${stdout}]`);

    } else {
        log.error(`error to determine if ${appName} is installed, \
            code=${code} stdout=${stdout}, stderr=${stderr}`);
        throw new ServiceError(ErrorType.ErrorToInstallImplementations);
    }

}
