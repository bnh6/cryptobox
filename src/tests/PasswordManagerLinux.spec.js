import { expect } from "chai";
const PasswordManagerLinux = require("../services/password/PasswordServiceLinux");

describe.skip("scripts/PasswordManagers/PasswordServiceLinux", () => {
  describe("searchForPassword()", () => {
    it("Given that pass is installed and cryptobox folder exists inside pass folder, should open the gpg dialog and if passphrase is correct return the password", () => {
      const sourceFolder = "/home/rafael/pasta-secreta";
      const passwordManager = new PasswordManagerLinux(sourceFolder);
      const results = passwordManager.searchForPassword();
      expect(results).to.eql([]);
    });
  });
});
