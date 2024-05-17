import fs = require('fs');
import rm = require('rimraf');
import path = require('path');

import chalk from 'chalk'
import { cleanup } from './utils'
import { MuddleArgs } from './cli';
import { transpileTest } from './transpile';

const spawn = require('child-process-promise').spawn;

const testFile = (filename: string, reporter: string): Promise<number> => {
    if (filename.includes('.test.js')) {
        const output = [];
        const promise = spawn('mocha', ['-R', reporter, filename], {stdio: "inherit"});

        return new Promise<number>((resolve, reject) => {
            promise
                .then(() => resolve(0))
                .catch((err: any) => {resolve(1) })
        })
    } else {
		return Promise.resolve(-1);
	}
};

const getReporter = (program: MuddleArgs) => {
    if (program.reporter) {
        return program.reporter
	}
    if (program.verbose) {
        return 'spec';
	}
    return 'nyan'
}

const getTestName = (program: MuddleArgs, filename: string, basename: string) => {
    let test_basename = filename.slice(0, -path.extname(filename).length);
    const testFilename = `${test_basename}.test.js`;
    if (fs.existsSync(testFilename)) {
        return testFilename;
    }

	// This might fit better someone else.  I'll have to consider that
    const testTsFilename = `${test_basename}.test.ts`;
    if (fs.existsSync(testTsFilename)) {
        transpileTest(program, testTsFilename);
        return `${test_basename}.test.js`;
    }

    return getTestDirFilename(program, basename)
}

const getTestDirFilename = (program: MuddleArgs, basename: string) => {
    const testDir = program.testDir ? program.testDir : path.join(process.cwd(), 'test')
    if (fs.existsSync(testDir)) {
        const newTestFilename = path.join(testDir, `${basename}.test.js`)
        if (fs.existsSync(newTestFilename)) {
            return newTestFilename
        }
    }
}

const doTest = async (program: MuddleArgs, filename: string, basename: string): Promise<number> => {
    const testFilename = getTestName(program, filename, basename);
    if (testFilename) {
        if (!program.quiet) {
            console.log(chalk.cyanBright('Testing') + ` - ${testFilename}`);
		}
        const reporter = getReporter(program);
		const failures = await testFile(testFilename, reporter);

		//We don't care when it's done being removed. Just remove it and swallow errors.
		rm(`${testFilename.slice(0,-3)}.ts`, (err)=>{});
        return failures;
    }
    return -1;
}

export async function test(program: MuddleArgs, filename: string, basename: string):Promise<number> {
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
    else {
        return 0;
    }
}
