"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const utils_1 = require("./utils");
const chalk_1 = require("chalk");
const transpile_1 = require("./transpile");
const rm = require("rimraf");
const spawn = require('child-process-promise').spawn;
const testFile = (filename, reporter) => {
    if (filename.includes('.test.js')) {
        const output = [];
        const promise = spawn('mocha', ['-R', reporter, filename], { stdio: "inherit" });
        return new Promise((resolve, reject) => {
            promise
                .then(() => resolve(0))
                .catch((err) => { resolve(1); });
        });
    }
};
const getReporter = (program) => {
    if (program.reporter)
        return program.reporter;
    if (program.verbose)
        return 'spec';
    return 'nyan';
};
const getTestName = (program, filename, basename) => {
    let test_basename = filename.slice(0, -path.extname(filename).length);
    const testFilename = `${test_basename}.test.js`;
    if (fs.existsSync(testFilename)) {
        return testFilename;
    }
    const testTsFilename = `${test_basename}.test.ts`;
    if (fs.existsSync(testTsFilename)) {
        transpile_1.transpileTest(program, testTsFilename);
        return `${test_basename}.test.js`;
    }
    return getTestDirFilename(program, basename);
};
const getTestDirFilename = (program, basename) => {
    const testDir = program.testDir ? program.testDir : path.join(process.cwd(), 'test');
    if (fs.existsSync(testDir)) {
        const newTestFilename = path.join(testDir, `${basename}.test.js`);
        if (fs.existsSync(newTestFilename)) {
            return newTestFilename;
        }
    }
};
const doTest = (program, filename, basename) => __awaiter(this, void 0, void 0, function* () {
    const testFilename = getTestName(program, filename, basename);
    if (testFilename) {
        if (!program.quiet)
            console.log(chalk_1.default.cyanBright('Testing') + ` - ${testFilename}`);
        const reporter = getReporter(program);
        const failures = yield testFile(testFilename, reporter);
        if (fs.existsSync(`${testFilename.slice(0, -3)}.ts`)) {
            rm.sync(testFilename);
        }
        return failures;
    }
    return -1;
});
function test(program, filename, basename) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!program.skipTests) {
            const numFailures = yield doTest(program, filename, basename);
            if (numFailures > 0) {
                console.log(chalk_1.default.red(`Failure`) + ' - ' + filename);
                utils_1.cleanup(filename);
            }
            if (numFailures == -1) {
                if (program.verbose) {
                    console.log(chalk_1.default.yellow(`No Tests Found`) + ' - ' + filename);
                }
            }
            return numFailures;
        }
    });
}
exports.test = test;
