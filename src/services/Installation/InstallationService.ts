import * as os from "os";
import log from "../LogService";
import { ErrorType, ServiceError } from "../ServiceError";
import * as win from "./InstallationServiceWindows";
import * as linux from "./InstallationServiceLinux";
import * as osx from "./InstallationServiceOSX";





export async function install() {
    try {
        switch (os.platform()) {
            case "win32":
                await win.install();
                break;

            case "linux":
                await linux.install();
                break;

            case "darwin":
                await osx.install();
                break;

            default: throw new ServiceError(ErrorType.UnsupportedOS);
        }
    } catch (error) {
        if (error instanceof ServiceError) throw error;
        
        // prob will never get here ...
        log.error(`Error to install implementations on ${os.platform}, ${error}`);
        throw new ServiceError(ErrorType.ErrorToInstallImplementations);
    }
}