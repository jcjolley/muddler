import fs = require('fs');

import chalk from 'chalk';
import { MuddleArgs } from './cli';
import { cleanup, anonymizeFirstFunction, replaceInStrIfScriptor } from './utils'

const ClosureCompiler = require('google-closure-compiler').compiler;

const getCompiler = (filename: string) => new ClosureCompiler({
    js: `${filename.slice(0,-3)}.temp.js`,
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    language_in: 'ECMASCRIPT6',
    language_out: 'ECMASCRIPT6',
    externs: __dirname + '/externs.js',
    warning_level: 'QUIET',
});

const isNotWarning = (str: string) => {
    const warningIndicators = ['WARNING: Skipping', 'factory features:', 'compiler features:', 'java -jar ', 'com.google.javascript.jscomp.PhaseOptimizer$NamedPass process'];
    return !warningIndicators.some(w => str.includes(w));
};

const filterStdErr = (str: string) => str.split('\n')
    .filter(isNotWarning)
    .filter(x => x)
    .join('\n');

const minify = (program: MuddleArgs, compiler: any, filename: string, basename: string) => {
    return new Promise((resolve, reject) => {
        compiler.run((exitCode:number, stdOut:string, stdErr:string) => {
            if (program.verbose) {
                console.log("Closure Output:", JSON.stringify(stdOut));
			}

            const out = restoreHackmud(stdOut);
            report(program, stdErr, basename)
            cleanup(filename);
            resolve(out);
        })
    })
}

const restoreHackmud = (stdOut:string) =>
    anonymizeFirstFunction(
        replaceInStrIfScriptor('\\\$', '#', stdOut))
        .slice(0, -2)

const report = (program: MuddleArgs, stdErr: string, filename: string) => {
    const filteredStdErr = filterStdErr(stdErr);
    if (filteredStdErr) {
        const separator = "\n==========================================\n"
        console.error(separator + chalk.red(filteredStdErr) + separator);
    } else if (!program.quiet) {
        console.log(chalk.green(`Success`) + ' - ' + chalk.italic(`${filename}_mud.js`));
    }
}

const writeCb = (basename: string, err: any) => {
    if (err) {
        console.log(`Error writing ${basename}`, err)
    }
}

export async function compile(program: MuddleArgs, filename: string, basename: string) {
    const compiler = getCompiler(filename);
    const out = await minify(program, compiler, filename, basename);
    fs.writeFileSync(`${basename}_mud.js`, out, 'utf8');
}