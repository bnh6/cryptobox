import { EncryptionServiceFactory } from "../services/encryption/EncryptionServiceFactory";
import { PasswordService } from "../services/password/PasswordService";
import { PasswordServiceFactory } from "../services/password/PasswordServiceFactory";

import { Volume } from "../entities/Volume";
import { Password } from "../entities/Password";
import * as constants from "../utils/constants";
import { expect } from "chai";
import * as shell from "shelljs";
var path = require("path")

import * as os from "os";

import { log } from "../utils/LogUtil";
log.debug("running password and encryption tests")



// const rootFolder = "~/cryptobox";
const rootFolder = path.join("/tmp", "cryptobox")
const sourceFolder = `${rootFolder}/encrypted`;
const destinationFolder = `${rootFolder}/decrypted`;
// const passwordValue = "MyPassword@2020";
const passwordValue = Math.random().toString(36).substr(2, 16);
log.debug(`generated password = [${passwordValue}]`)


const volume: Volume = new Volume(
  sourceFolder,
);
const password: Password = new Password(passwordValue);

const validateShellExecution = (result: any) => {
  if (result.code != 0) {
    console.log(
      `function failed, result=[${result.code}], stdout=[${result.stdout}] stderr[${result.stderr}]`
    );
    throw new Error(`function returned ${result.code}`);
  }
};

console.debug("testing encryption code")

describe("testing password and encryption together", () => {
  before(() => {
    validateShellExecution(shell.exec(`mkdir -p "${rootFolder}"`));
    validateShellExecution(shell.exec(`mkdir -p "${volume.encryptedFolderPath}"`));
    validateShellExecution(shell.exec(`mkdir -p "${volume.decryptedFolderPath}"`));
  });

  it("create password", () => {
    let passwordService: PasswordService = PasswordServiceFactory.create();
    passwordService.saveNewPassword(password, volume);
  });


  it("retrieve password", () => {
    let returnedPassword: Password;
    let passwordService: PasswordService = PasswordServiceFactory.create();
    returnedPassword = passwordService.searchForPassword(volume);

    expect(returnedPassword.passwordValue).to.eql(passwordValue + "\n");
  });

  it("mount volume", () => {
    let encryptionService = EncryptionServiceFactory.create();
    encryptionService.mount(volume, password);
  }).timeout(25000);

  it("is volume mounted", () => {
    let encryptionService = EncryptionServiceFactory.create();
    let isMounted = encryptionService.isMounted(volume);
    expect(isMounted).to.eql(true);
  });


  it("umount volume", () => {
    let encryptionService = EncryptionServiceFactory.create();
    encryptionService.unmount(volume);
  }).timeout(25000);

  it("should not be mounted", () => {
    let encryptionService = EncryptionServiceFactory.create();
    let isMounted = encryptionService.isMounted(volume);
    expect(isMounted).to.eql(false);
  });

  it("delete password", () => {
    if (os.platform() == "darwin") {
      let passwordService: PasswordService = PasswordServiceFactory.create();
      passwordService.deletePassword(volume);
    }
  });

  after(() => {
    validateShellExecution(shell.rm("-rf", rootFolder));
  });
});
