import PasswordService from "../services/password/PasswordService";
import { ServiceError } from "../services/ServiceError";
import { Volume } from "../entities/Volume";
import { expect } from "chai";

const password = Math.random().toString(36).substr(2, 16);
const volume = new Volume("~/");
const passwordService: PasswordService = new PasswordService();

console.log(`generated password = [${password}]`);
console.log(`generated volume = [${volume.getVolumeAlias()}]`);

// disbaling logs for cleaner stdout (is this a good thing???)
import log from "../utils/LogUtil";
log.transports.file.level = false;
log.transports.console.level = false;


async function cleanPassword() {
    try {
        await passwordService.deletePassword(volume);
    } catch (error) {
        console.log(`deleted a password that does not exist (safe to ignore), ${error}`);
    }
}

describe("  >>>>  EXECUTING PASSWORD SERVICE  TESTS  <<<<  ", () => {
    before(() => {
        cleanPassword();
    });

    it("retrieve non-existing password", async () => {
        const returnedPassword = await passwordService.searchForPassword(volume);
        expect(returnedPassword).to.be.null;
    });

    it("create password", async () => {
        await passwordService.savePassword(password, volume);
    });


    it("retrieve password correclty", async () => {
        const returnedPassword = await passwordService.searchForPassword(volume);
        expect(returnedPassword).to.eql(password);
    });

    it("delete password", async () => {
        await passwordService.deletePassword(volume);
    });

    it("retrieve password after delete", async () => {
        const returnedPassword = await passwordService.searchForPassword(volume);
        expect(returnedPassword).to.null;
    });

    it("delete non-existing password", async () => {
        expect(async () => {
            await passwordService.deletePassword(volume);
        }).not.to.throw(ServiceError);
    });

    it("create password with null password", () => {
        passwordService.savePassword(null, volume).catch(error => {
            expect(error).to.be.an.instanceOf(ServiceError);
        });
    });

    it("create password with null volume", () => {
        passwordService.savePassword(password, null).catch(error => {
            expect(error).to.be.an.instanceOf(ServiceError);
        });
    });

    after(() => {
        cleanPassword();
    });
});
