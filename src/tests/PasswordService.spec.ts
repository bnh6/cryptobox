import { PasswordService } from "../services/password/PasswordService";
import PasswordServiceError from "../services/password/PasswordError";
import { Volume } from "../entities/Volume";
import { expect } from "chai";
import log from "../utils/LogUtil";

log.debug("Executing password tests");

const password = Math.random().toString(36).substr(2, 16);
const volume = new Volume("~/");
const passwordService: PasswordService = new PasswordService();

log.debug(`generated password = [${password}]`);
log.debug(`generated volume = [${volume.getVolumeAlias()}]`);
log.info("testing password service");

async function cleanPassword() {
    try {
        await passwordService.deletePassword(volume);
    } catch (error) {
        log.debug(`deleted a password that does not exist (safe to ignore), ${error}`);
    }
}

describe("password service tests", () => {
    before(() => {
        cleanPassword();
    });

    it("retrieve non-existing password", async () => {
        let returnedPassword = await passwordService.searchForPassword(volume);
        expect(returnedPassword).to.null;
    });

    it("create password", async () => {
        await passwordService.savePassword(password, volume);
    });

    it("create password with null", async () => {
        expect(await passwordService.savePassword(null, volume)).to.throw(PasswordServiceError);
    });

    it("create password with null volume", async () => {
        expect(await passwordService.savePassword(password, volume)).to.throw(PasswordServiceError);
    });

    it("retrieve password correclty", async () => {
        let returnedPassword = await passwordService.searchForPassword(volume);
        expect(returnedPassword).to.eql(password);
    });

    it("delete password", async () => {
        await passwordService.deletePassword(volume);
    });

    it("retrieve password after delete", async () => {
        let returnedPassword = await passwordService.searchForPassword(volume);
        expect(returnedPassword).to.null;
    });

    it("delete non-existing password", async () => {
        expect(await passwordService.deletePassword(volume)).to.throw(PasswordServiceError);
    });

    after(() => {
        cleanPassword();
    });
});
