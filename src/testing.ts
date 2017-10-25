import Mocha = require('mocha')
import fs = require('fs')
import path = require('path')
import * as silentReporter from 'mocha-silent-reporter'
import { cleanup } from './utils'
import chalk from 'chalk'

const testFile = (filename, reporter) => {
    if (filename.includes('.test.js')) {
        const output = [];
        const mocha = new Mocha({ reporter: reporter });
        delete require.cache[filename]
        mocha.addFile(filename);

        return new Promise((resolve, reject) => {
            mocha.run(failures => {
                resolve(failures);
            })
        })
    }
};

const getReporter = (program) => {
    if (program.verbose)
        return 'spec';
    if (program.quiet)
        return function reporter(runner) { }
    return silentReporter
}

const getTestName = (filename: string, basename) => {
    let test_basename = filename.slice(0, -path.extname(filename).length)
    const testFilename = `${test_basename}.test.js`;
    if (fs.existsSync(testFilename)) {
        return testFilename
    }

    return getTestDirFilename(basename)
}

const getTestDirFilename = (basename) => {
    const testDir = path.join(process.cwd(), 'test')
    if (fs.existsSync(testDir)) {
        const newTestFilename = path.join(testDir, `${basename}.test.js`)
        if (fs.existsSync(newTestFilename)) {
            return newTestFilename
        }
    }
}

const doTest = async (program, filename, basename) => {
    const testFilename = getTestName(filename, basename);
    if (testFilename) {
        if (!program.quiet)
            console.log(chalk.cyanBright('Testing') + ` - ${testFilename}`)
        const reporter = getReporter(program);
        const failures = await testFile(testFilename, reporter)
        return failures
    }
    return -1
}

export async function test(program, filename, basename) {
    if (!program.skipTests) {
        const numFailures = await doTest(program, filename, basename);
        if (numFailures > 0) {
            console.log(chalk.red(`Failure`) + ' - ' + filename + ` - ` + chalk.bgRed(numFailures) + ` failing test(s)`)
            cleanup(filename)
        }
        if (numFailures == -1) {
            if (program.verbose) {
                console.log(chalk.yellow(`No Tests Found`) + ' - ' + filename)
            }
        }
        return numFailures
    }
}
