import { PasswordService } from "../services/password/PasswordService";
import { PasswordServiceFactory } from "../services/password/PasswordServiceFactory";
import PasswordServiceError from "../services/password/PasswordError";
import { Volume } from "../entities/Volume";
import { Password } from "../entities/Password";
import { expect } from "chai";
import * as shell from "../utils/ShellUtil";
import * as path from "path";
import * as os from "os";
import log from "../utils/LogUtil";

log.debug("Executing password tests");

const password = Math.random().toString(36).substr(2, 16);
const volume = Math.random().toString(32);
const passwordService: PasswordService = PasswordServiceFactory.create();

log.debug(`generated password = [${password}]`);
log.debug(`generated volume = [${volume}]`);
log.info("testing password service");

function cleanPassword() {
    try {
        passwordService.deletePassword(volume);
    } catch (error) {
        log.debug(`deleted a password that does not exist (safe to ignore), ${error}`);
    }
}

describe("password service tests", () => {
    before(() => {
        cleanPassword();
    });

    it("retrieve non-existing password", () => {
        let returnedPassword = passwordService.searchForPassword(volume);
        expect(returnedPassword).to.null;
    });

    it("create password", () => {
        const passwordService: PasswordService = PasswordServiceFactory.create();
        passwordService.savePassword(password, volume);
    });

    it("create password with null", () => {
        const passwordService: PasswordService = PasswordServiceFactory.create();
        passwordService.savePassword(null, volume);
        expect(passwordService.searchForPassword(volume)).to.throw(PasswordServiceError);
    });

    it("create password with null volume", () => {
        const passwordService: PasswordService = PasswordServiceFactory.create();
        passwordService.savePassword(password, volume);
        expect(passwordService.searchForPassword(volume)).to.throw(PasswordServiceError);
    });

    it("retrieve password correclty", () => {
        let returnedPassword = passwordService.searchForPassword(volume);
        expect(returnedPassword).to.eql(password);
    });

    it("delete password", () => {
        let passwordService: PasswordService = PasswordServiceFactory.create();
        passwordService.deletePassword(volume);
    });

    it("retrieve password after delete", () => {
        let returnedPassword = passwordService.searchForPassword(volume);
        expect(returnedPassword).to.null;
    });

    it("delete non-existing password", () => {
        let passwordService: PasswordService = PasswordServiceFactory.create();
        passwordService.deletePassword(volume);
        expect(passwordService.searchForPassword(volume)).to.throw(PasswordServiceError);
    });

    after(() => {
        cleanPassword();
    });
});
