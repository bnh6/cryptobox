import * as constants from "../utils/constants";
var path = require('path');
var os  = require('os')

export class Volume {
    name: string;
    ttl: number;
    encryptedFolderPath: string;
    decryptedFolderPath: string;
    
    constructor(encryptedFolderPath: string) {
        this.encryptedFolderPath = encryptedFolderPath;
        this.ttl = 30; //TODO get from property
        this.name = String(path.parse(this.encryptedFolderPath).base)//TODO move this app layer ...
        this.decryptedFolderPath = String(path.join(os.homedir(),"cryptobox", this.name)) //TODO move this to app layer
    }

    getVolumeAlias(): string | null {
        if (this.encryptedFolderPath)
            return `${constants.VOLUME_ALIAS_SUFFIX}://${this.encryptedFolderPath}`
        else return null;

    }
}