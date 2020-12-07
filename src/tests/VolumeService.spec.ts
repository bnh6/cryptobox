import VolumeService from "../services/volume/VolumeService";
import { ServiceError } from "../services/ServiceError";
import PasswordService from "../services/password/PasswordService";
import { Volume } from "../entities/Volume";
import { expect } from "chai";
import { VolumeEncryptionImpl } from "../services/volume/wrappers/VolumeServiceWrapperFactory";





const VolEncImplList = Object.keys(VolumeEncryptionImpl).filter(k =>  !isNaN(Number(k)) === false);

VolEncImplList.forEach(e => {

    const volEncImpl: VolumeEncryptionImpl = (<any>VolumeEncryptionImpl)[e];
    const volumeService = new VolumeService(volEncImpl);
    const impl = VolumeEncryptionImpl[volEncImpl];

    const password = Math.random().toString(36).substr(2, 16);
    const volume = new Volume("/tmp/cryptobox-enc" + Math.random().toString(12).substr(2, 10));
    volume.decryptedFolderPath = "/tmp/cryptobox-dec" + Math.random().toString(12).substr(2, 10);
    // could use the pasword variable, but would be more realistic to use the passwordservice
    const passwordService = new PasswordService();

    const volumeEncryptionSupport = volumeService.isVolumeOperationsSupported();
    console.log(`VOLUME ENCRYPTION SUPPORT ${volumeEncryptionSupport}`);

    (volumeEncryptionSupport ? describe : describe.skip)(
        `  >>>>  EXECUTING VOLUME SERVICE TESTS [${impl}]  <<<<  `, () => {
            before(async () => {
                volumeService.createDirectory(volume.decryptedFolderPath);
                volumeService.createDirectory(volume.encryptedFolderPath);
                try {
                    await passwordService.savePassword(password, volume);
                } catch (error) {
                    console.error("Error to create the password, aborting ...");
                    throw error;
                }
            });

            it(`[${impl}] does it support volume encryption?`, () => {
                const support = volumeService.isVolumeOperationsSupported();
                expect(support).to.true;
            });

            it(`[${impl}] not mounted before mounting`, async () => {
                const mounted = await volumeService.isMounted(volume);
                expect(mounted).to.false;
            });

            it(`[${impl}] mount`, async () => {
                expect(async () => {
                    // TODO enabling the password lookup, causes the execution to carryon and do not wait.
                    // need to investigate it.
                    // const password = await passwordService.searchForPassword(volume);
                    await volumeService.mount(volume, password);
                }).not.to.throw();
            });

            it(`[${impl}] mounted, after mount`, async () => {
                const mounted = await volumeService.isMounted(volume);
                expect(mounted).to.true;
            });

            it(`[${impl}] UNmount`, async () => {
                expect(async () => {
                    await volumeService.unmount(volume);
                }).not.to.throw();
            });

            it(`[${impl}] not mounted, after UNmount`, async () => {
                const mounted = await volumeService.isMounted(volume);
                expect(mounted).to.false;
            });



            // it(`[${impl}] mount with idle=1min`, async () => {
            //     expect(async () => {
            //         // TODO enabling the password lookup, causes the execution to carryon and do not wait.
            //         // need to investigate it.
            //         // const password = await passwordService.searchForPassword(volume);
            //         await volumeService.mount(volume, password, 1);
            //     }).not.to.throw();
            // });

            // it(`[${impl}] mounted, after mount with idle=1`, async () => {
            //     const mounted = await volumeService.isMounted(volume);
            //     expect(mounted).to.true;
            // });

            // it(`[${impl}] wait for 90 seconds=`, (done) => {
            //     setTimeout(function () {
            //         done();
            //     }, 90000);
            // }).timeout(95000);

            // it(`[${impl}] should not be mounted given the idle`, async () => {
            //     const mounted = await volumeService.isMounted(volume);
            //     expect(mounted).to.false;
            // });

            // it(`[${impl}] mount without permission on encrypted`, () => { });

            // it(`[${impl}] mount without permission on decrypted`, () => { });


            // it(`[${impl}] mount when encrypted does exist`, () => { });

            // it(`[${impl}] mount when decrypted does exist`, () => { }); //to create and succeed

            // it(`[${impl}] mount with wrong password`, () => { });

            // it(`[${impl}] mount without`, () => { });

            after(async () => {
                volumeService.deleteDirectory(volume.decryptedFolderPath);
                volumeService.deleteDirectory(volume.encryptedFolderPath);
                try {
                    await passwordService.deletePassword(volume);
                } catch (error) {
                    console.error("Error to delete the password, aborting ...");
                    throw error;
                }
            });

        });


});



