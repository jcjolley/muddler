module.exports = (function() {

    const Mocha = require('mocha')
    const fs = require('fs')
    const path = require('path')
    const silentReporter = require('mocha-silent-reporter')
    const {cleanup} = require('./utils')
    const chalk = require('chalk')

    const testFile = (filename, reporter) => {
        if (filename.includes('.test.js')) {
            const output = [];
            const mocha = new Mocha({ reporter: reporter });
            mocha.addFile(filename);

            return new Promise((resolve, reject) =>
                mocha.run(failures => {
                    resolve(failures);
                })
            )
        }
    };

    const getReporter = (program) => {
        if (program.verbose)
            return 'spec';
        if (program.quiet)
            return function reporter(runner) { }
        return silentReporter
    }

    const doTest = async (program, filename) => {
        let testFilename = `${filename}.test.js`
        if (fs.existsSync(testFilename)) {
            if (!program.quiet)
                console.log(chalk.cyanBright('Testing') + ` - ${testFilename}`)
            const reporter = getReporter(program);
            const failures = await testFile(testFilename, reporter)
            return failures
        }
    }

    return async function test(program, filename, basename) {
        if (!program.skipTests) {
            const numFailures = await doTest(program, basename);
            if (numFailures > 0) {
                console.log(chalk.red(`Failure`) + ' - ' + filename + ` - ` + chalk.bgRed(numFailures) + ` failing test(s)`)
                cleanup(filename)
            }
            return numFailures
        }
    }
})()