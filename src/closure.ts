import fs = require('fs');
import gccJs = require('google-closure-compiler-js');

import { CompileFlags, CompileOutput } from 'google-closure-compiler-js';

import { MuddleArgs } from './cli';


enum Severity {
	normal,
	success,
	error
}

function mr4Log(str:string, s=Severity.normal):void{
	let face:string = '??/??';
	let color:number = 255;
	switch(s){
		case Severity.normal:
		color = 202;
		face = '⠈⠐_⠂⠁';
		break;

		case Severity.success:
		color = 208;
		face = '^^ᵥ^^';
		break;

		case Severity.error:
		color = 196;
		face = ';;ₙ;;';
		break;
	}
	console.log(`\u001b[38;5;${color}m${face} ${str}\u001b[0m`);
}

/**
 * Generates flags used for gccJs.
 */
function getFlags(file:string):CompileFlags {
	return {
		compilationLevel:'ADVANCED',
		languageIn:'ECMASCRIPT6',
		languageOut:'ECMASCRIPT6',
		externs: [__dirname+'/externs.js']
	};
}
/*

import chalk from 'chalk';
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
*/

export async function compile(program: MuddleArgs, filename: string, basename: string):Promise<void> {

	mr4Log(filename);
	mr4Log(basename);
	return new Promise<void>((resolve, reject)=>{
		fs.writeFile(`${basename}_mud.js`, '', 'utf8', (err)=>{
			if(err) {
				reject(err);
			}
			else {
				resolve();
			}
		});
	});
}
