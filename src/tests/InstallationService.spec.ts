import { expect } from "chai";
import * as os from "os";
import * as installService from "../services/Installation/InstallationService";

describe("  >>>>  EXECUTING INSTALATION SERVICE  TESTS  <<<<  ", () => {
    it(`installing implementations on ${os.platform()}`, async () => {
        expect(async () => {
            installService.install();
        }).not.throw();
    }).timeout(300000);
    

    /**
     * TODO inscrease tests coverage
     */

});