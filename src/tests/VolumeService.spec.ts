import VolumeService from "../services/VolumeService";
import VolumeServiceError from "../services/VolumeServiceError";
import { Volume } from "../entities/Volume";
import { expect } from "chai";


const password = Math.random().toString(36).substr(2, 16);
const volume = new Volume("/tmp/cryptobox-enc");
volume.decryptedFolderPath = "/tmp/cryptobox-dec";
const volumeService = new VolumeService();

describe("  >>>>  EXECUTING VOLUME SERVICE  TESTS  <<<<  ", () => {
    before(() => {
        volumeService.createDirectory(volume.decryptedFolderPath);
        volumeService.createDirectory(volume.encryptedFolderPath);
    });

    it("isMounted -> NOT mounted", () => { });
    it("mount", () => {   });
    it("isMounted ->  mounted", () => {   });
    it("UNmount", () => { });
    it("isMounted -> NOT mounted", () => { });

    it("UNmount -> NOT mounted", () => { });
    it("mount without permission on encrypted", () => { });
    it("mount without permission on decrypted", () => { });

    it("mount when encrypted does exist", () => { });
    it("mount when decrypted does exist", () => { }); //to create and succeed

    it("mount with wrong password", () => { }); 
    it("mount without", () => { }); 

    after(() => {
        volumeService.deleteDirectory(volume.decryptedFolderPath);
        volumeService.deleteDirectory(volume.encryptedFolderPath);
    });

});