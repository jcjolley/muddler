var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (function () {
    const Mocha = require('mocha');
    const fs = require('fs');
    const path = require('path');
    const silentReporter = require('mocha-silent-reporter');
    const { cleanup } = require('./utils');
    const chalk = require('chalk');
    const testFile = (filename, reporter) => {
        if (filename.includes('.test.js')) {
            const output = [];
            const mocha = new Mocha({ reporter: reporter });
            mocha.addFile(filename);
            return new Promise((resolve, reject) => mocha.run(failures => {
                resolve(failures);
            }));
        }
    };
    const getReporter = (program) => {
        if (program.verbose)
            return 'spec';
        if (program.quiet)
            return function reporter(runner) { };
        return silentReporter;
    };
    const doTest = (program, filename) => __awaiter(this, void 0, void 0, function* () {
        let testFilename = `${filename}.test.js`;
        if (fs.existsSync(testFilename)) {
            if (!program.quiet)
                console.log(chalk.cyanBright('Testing') + ` - ${testFilename}`);
            const reporter = getReporter(program);
            const failures = yield testFile(testFilename, reporter);
            return failures;
        }
    });
    return function test(program, filename, basename) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!program.skipTests) {
                const numFailures = yield doTest(program, basename);
                if (numFailures > 0) {
                    console.log(chalk.red(`Failure`) + ' - ' + filename + ` - ` + chalk.bgRed(numFailures) + ` failing test(s)`);
                    cleanup(filename);
                }
                return numFailures;
            }
        });
    };
})();
