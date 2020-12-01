import { PasswordService } from "../services/password/PasswordService";
import { PasswordServiceFactory } from "../services/password/PasswordServiceFactory";
import { Volume } from "../entities/Volume";
import { Password } from "../entities/Password";
import { expect } from "chai";
import * as shell from "../utils/ShellUtil";
import * as path from "path";
import * as os from "os";
import log from "../utils/LogUtil";

log.debug("Executing password tests");

// const rootFolder = "~/cryptobox";
const rootFolder: string = path.join("/tmp", "cryptobox");
const sourceFolder: string = `${rootFolder}/encrypted`;
// const destinationFolder = `${rootFolder}/decrypted`;
// const passwordValue = "MyPassword@2020";
const passwordValue = Math.random().toString(36).substr(2, 16);
log.debug(`generated password = [${passwordValue}]`);

const volume: Volume = new Volume(sourceFolder);
const password: Password = new Password(passwordValue);
const passwordService: PasswordService = PasswordServiceFactory.create();

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
    let returnedPassword: Password;
    returnedPassword = passwordService.searchForPassword(volume);
    expect(returnedPassword).to.null;
  });


  it("create password", () => {
    const passwordService: PasswordService = PasswordServiceFactory.create();
    passwordService.savePassword(password, volume);
  });

  it("retrieve password", () => {
    let returnedPassword: Password;
    returnedPassword = passwordService.searchForPassword(volume);
    expect(returnedPassword.passwordValue).to.eql(passwordValue);
  });


  it("delete password", () => {
    let passwordService: PasswordService = PasswordServiceFactory.create();
    passwordService.deletePassword(volume);

  });

  it("retrieve password after delete", () => {
    let returnedPassword: Password;
    returnedPassword = passwordService.searchForPassword(volume);
    expect(returnedPassword).to.null;
  });

  it("delete non-existing password", () => {
    let passwordService: PasswordService = PasswordServiceFactory.create();
    passwordService.deletePassword(volume);
  });

  after(() => {
    cleanPassword();
  });
});
