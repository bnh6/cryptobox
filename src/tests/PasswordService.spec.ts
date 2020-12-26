import PasswordService from "../services/password/PasswordService";
import { ServiceError } from "../services/ServiceError";
import { Volume } from "../entities/Volume";
import { expect } from "chai";
import * as os from "os";

const password = Math.random().toString(36).substr(2, 16);
const volume = new Volume(os.homedir());
const passwordService: PasswordService = new PasswordService();

console.log(`generated password = [${password}]`);
console.log(`generated volume = [${volume.getVolumeAlias()}]`);



// disbaling logs for cleaner stdout (is this a good thing???)
import log from "../services/LogService";
log.transports.file.level = false;
log.transports.console.level = false;



async function cleanPassword() {
    try {
        await passwordService.deletePassword(volume);
    } catch (error) {
        console.log(`deleted a password that does not exist (safe to ignore), ${error}`);
    }
}

// TODO skiping until keytar works on headless linux
const skipOnLinux = os.platform() === "linux" ? true : false;

(!skipOnLinux ? describe : describe.skip)("  >>>>  EXECUTING PASSWORD SERVICE  TESTS  <<<<  ", () => {
    before(() => {
        cleanPassword();
    });

    it("retrieving a non-existing password (should return null)", async () => {
        const returnedPassword = await passwordService.searchForPassword(volume);
        expect(returnedPassword).to.be.null;
    });

    it("creating a password with success", async () => {
        await passwordService.savePassword(password, volume);
    });


    it("retrieving password correclty", async () => {
        const returnedPassword = await passwordService.searchForPassword(volume);
        expect(returnedPassword).to.eql(password);
    });

    it("deleting password with success", async () => {
        await passwordService.deletePassword(volume);
    });

    it("retrieving non-existing password (after delete)", async () => {
        const returnedPassword = await passwordService.searchForPassword(volume);
        expect(returnedPassword).to.null;
    });

    it("deleting non-existing password", async () => {
        expect(async () => {
            await passwordService.deletePassword(volume);
        }).not.to.throw(ServiceError);
    });

    it("creating password with null value", () => {
        passwordService.savePassword(null, volume).catch(error => {
            expect(error).to.be.an.instanceOf(ServiceError);
        });
    });

    it("creating password with null volume", () => {
        passwordService.savePassword(password, null).catch(error => {
            expect(error).to.be.an.instanceOf(ServiceError);
        });
    });

    after(() => {
        cleanPassword();
    });
});
