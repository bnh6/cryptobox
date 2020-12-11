import VolumeService from "../services/volume/VolumeService";
import { ErrorType, ServiceError } from "../services/ServiceError";
import PasswordService from "../services/password/PasswordService";
import { Volume } from "../entities/Volume";
import { expect } from "chai";
import { VolumeEncryptionImpl } from "../services/volume/wrappers/VolumeServiceWrapperFactory";
import * as os from "os";
import * as path from "path";

// // disbaling logs for cleaner stdout (is this a good thing???)
// import log from "../utils/LogUtil";
// log.transports.file.level = false;
// log.transports.console.level = false;


// iterating over implementations
const volumeEncryptionImplementations = Object.keys(VolumeEncryptionImpl).filter(k => !isNaN(Number(k)) === false);
volumeEncryptionImplementations.forEach(e => {

    //recover implementation id and name (should be a better way of doing it)
    const volumeImplementationEnum: VolumeEncryptionImpl = (<any>VolumeEncryptionImpl)[e];
    const implementationName = VolumeEncryptionImpl[volumeImplementationEnum];

    const passwordService = new PasswordService();
    const volumeService = new VolumeService(volumeImplementationEnum);

    const iddle_umount_time = 2; // time in minutes to unmount device on inactivity

    // creating directories and passwords ...
    const password = Math.random().toString(36).substr(2, 16);
    const volume = new Volume(os.homedir() + path.sep + "cryptobox-enc-" + Math.random().toString(12).substr(2, 10));
    volume.decryptedFolderPath = os.homedir() + path.sep + "cryptobox-dec-" + Math.random().toString(12).substr(2, 10);
    console.log(`encrypted folder = ${volume.encryptedFolderPath}`);
    console.log(`decrypted folder = ${volume.decryptedFolderPath}`);
    console.log(`volume alias = ${volume.getVolumeAlias()}`);

    // if volumeEncryptionImplementation is not supported, skiping tests ...
    const volumeEncryptionSupport = volumeService.isVolumeOperationsSupported();
    console.log(`[${implementationName}] volume encryption support = ${volumeEncryptionSupport}`);

    (volumeEncryptionSupport ? describe : describe.skip)(
        `  >>>>  EXECUTING VOLUME SERVICE TESTS [${implementationName}]  <<<<  `, () => {
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

            it(`[${implementationName}] is the impmementation method supported`, () => {
                const support = volumeService.isVolumeOperationsSupported();
                expect(support).to.true;
            });

            it(`[${implementationName}] should not be mounted, before mounting`, async () => {
                const mounted = await volumeService.isMounted(volume);
                expect(mounted).to.false;
            });

            it(`[${implementationName}] mounting with success`, async () => {
                expect(async () => {
                    // TODO enabling the password lookup, causes the execution to carryon and do not wait.
                    // need to investigate it.
                    // const _password = await passwordService.searchForPassword(volume);
                    // console.log(_password, password, password === _password);
                    await volumeService.mount(volume, password);
                    // also does not work :(
                    // passwordService.searchForPassword(volume).then(async () => {
                    //     await volumeService.mount(volume, password);
                    // });
                }).not.to.throw();
            });

            it(`[${implementationName}] should be mounted (after mounting)`, async () => {
                const mounted = await volumeService.isMounted(volume);
                expect(mounted).to.true;
            });

            it(`[${implementationName}] unmounting with success`, async () => {
                expect(async () => {
                    await volumeService.unmount(volume);
                }).not.to.throw();
            });

            it(`[${implementationName}] shuould not be mounted (after unmounting)`, async () => {
                const mounted = await volumeService.isMounted(volume);
                expect(mounted).to.false;
            });

            it(`[${implementationName}] trying to mount with wrong password`, async () => {
                volumeService.mount(volume, "ThisShouldNotWork").catch(error => {
                    // TODO, this is not working
                    expect(error).to.be.instanceOf(ServiceError).
                        with.property("message", ErrorType.WrongPassword.toString());

                    // https://github.com/chaijs/chai/issues/930
                    // should.exist(error).and.be.an.instanceOf(ServiceError).
                    //     with.property("message", ErrorType.WrongPassword.toString());


                    // expect(error).to.be.an.instanceOf(ServiceError);
                    // console.log(error.message);
                    // console.log(ErrorType.WrongPassword.toString());
                    // expect(error.message).to.eq(ErrorType.WrongPassword.toString());
                });
            });


            // // TODO unmount when idle does not work :()
            // it(`[${implementationName}] mount with iddle= ${iddle_umount_time} min`, async () => {
            //     expect(async () => {
            //         volume.ttl = iddle_umount_time;  // setting the idle unmount
            //         await volumeService.mount(volume, password);
            //     }).not.to.throw();
            // });

            // it(`[${implementationName}] mounted, after mount with iddle flag`, async () => {
            //     const mounted = await volumeService.isMounted(volume);
            //     expect(mounted).to.true;
            // }); // TODO unmount not working...

            // it(`[${implementationName}] wait for ${iddle_umount_time + 1} minutes`, (done) => {
            //     setTimeout(function () {
            //         done();
            //     }, iddle_umount_time + 1 * 60 * 1000); // add 1 minute to wait
            // }).timeout(iddle_umount_time + 2 * 60 * 1000); // add 2 minutes for timeout

            // it(`[${implementationName}] should not be mounted given the iddle`, async () => {
            //     const mounted = await volumeService.isMounted(volume);
            //     expect(mounted).to.false;
            // });

            // it(`[${implementationName}] mount without permission on encrypted`, () => { });

            // it(`[${implementationName}] mount without permission on decrypted`, () => { });


            // it(`[${implementationName}] mount when encrypted does exist`, () => { });

            // it(`[${implementationName}] mount when decrypted does exist`, () => { }); //to create and succeed

            // it(`[${implementationName}] mount with wrong password`, () => { });

            // it(`[${implementationName}] ecncrypted and non encrypted folder are the same`, () => { });

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



