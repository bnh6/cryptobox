import { expect } from "chai";
import * as os from "os";
import * as installService from "../services/Installation/InstallationService";
import * as shell from "../services/ShellService";

describe("  >>>>  EXECUTING INSTALATION SERVICE  TESTS  <<<<  ", () => {
    it(`installing implementations on ${os.platform()}`, async () => {
        expect(async () => {
            installService.install();
        }).not.throw();
    }).timeout(420000); //7min

    it("encfs must be installed", async () => {
        const [code, stdout, stderr] = await shell.execute("encfs", ["--version"], false);
        expect(code).to.equal(0);
    });

    it("cryfs must be installed", async () => {
        const [code, stdout, stderr] = await shell.execute("cryfs", ["--version"], false);
        expect(code).to.equal(0);
    });

    

    /**
     * TODO inscrease tests coverage
     */

});