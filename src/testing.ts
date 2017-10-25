import fs = require('fs')
import path = require('path')
import { cleanup } from './utils'
import chalk from 'chalk'
const spawn = require('child-process-promise').spawn;

const testFile = (filename, reporter) => {
    if (filename.includes('.test.js')) {
        const output = [];
        const promise = spawn('mocha', ['-R', reporter, filename], {stdio: "inherit"})

        return new Promise((resolve, reject) => {
            promise
                .then(() => resolve(0))
                .catch((err) => {resolve(1) })
        })
    }
};

const getReporter = (program) => {
    if (program.verbose)
        return 'spec';
    return 'nyan'
}

const getTestName = (program, filename: string, basename) => {
    let test_basename = filename.slice(0, -path.extname(filename).length)
    const testFilename = `${test_basename}.test.js`;
    if (fs.existsSync(testFilename)) {
        return testFilename
    }

    return getTestDirFilename(program, basename)
}

const getTestDirFilename = (program, basename) => {
    const testDir = program.testDir ? program.testDir : path.join(process.cwd(), 'test')
    if (fs.existsSync(testDir)) {
        const newTestFilename = path.join(testDir, `${basename}.test.js`)
        if (fs.existsSync(newTestFilename)) {
            return newTestFilename
        }
    }
}

const doTest = async (program, filename, basename) => {
    const testFilename = getTestName(program, filename, basename);
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
            console.log(chalk.red(`Failure`) + ' - ' + filename)
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
