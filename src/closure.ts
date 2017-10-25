import chalk from 'chalk';
const ClosureCompiler = require('google-closure-compiler').compiler;
import fs = require('fs');
import { cleanup, anonymizeFirstFunction, replaceInStrIfScriptor } from './utils'

const getCompiler = (filename) => new ClosureCompiler({
    js: `${filename.slice(0,-3)}.temp.js`,
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    language_in: 'ECMASCRIPT6',
    language_out: 'ECMASCRIPT6',
    externs: __dirname + '/externs.js',
    warning_level: 'QUIET',
});

const isNotWarning = (str) => {
    const warningIndicators = ['WARNING: Skipping', 'factory features:', 'compiler features:', 'java -jar ', 'com.google.javascript.jscomp.PhaseOptimizer$NamedPass process'];
    return !warningIndicators.some(w => str && str.includes(w));
};

const filterStdErr = str => str.split('\n')
    .filter(isNotWarning)
    .filter(x => x)
    .join('\n');

const minify = (program, compiler, filename, basename) => {
    return new Promise((resolve, reject) => {
        compiler.run((exitCode, stdOut, stdErr) => {
            if (program.verbose)
                console.log("Closure Output:", JSON.stringify(stdOut));

            const out = restoreHackmud(stdOut);
            report(program, stdErr, basename)
            cleanup(filename);
            resolve(out);
        })
    })
}

const restoreHackmud = stdOut =>
    anonymizeFirstFunction(
        replaceInStrIfScriptor('\\\$', '#', stdOut))
        .slice(0, -2)

const report = (program, stdErr, filename) => {
    const filteredStdErr = filterStdErr(stdErr);
    if (filteredStdErr) {
        const separator = "\n==========================================\n"
        console.error(separator + chalk.red(filteredStdErr) + separator);
    } else if (!program.quiet) {
        console.log(chalk.green(`Success`) + ' - ' + chalk.italic(`${filename}_mud.js`));
    }
}

const writeCb = basename => err => {
    if (err) {
        console.log(`Error writing ${basename}`, err)
    }
}

export async function compile(program, filename, basename) {
    const compiler = getCompiler(filename);
    const out = await minify(program, compiler, filename, basename)
    fs.writeFileSync(`${basename}_mud.js`, out, 'utf8')
    }