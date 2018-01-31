import fs = require('fs');
import tsc = require('typescript');

import { minify, MinifyOutput, MinifyOptions } from 'uglify-es';
import { cleanup, anonymizeFirstFunction, replaceInStrIfScriptor } from './utils'

import { rmdir } from 'fs';
import { MuddleArgs } from './cli';
import { dirname, basename } from 'path';
import { isUndefined } from 'util';

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
function getFlags(file:string) {
	mr4Log(__dirname);
	let code = fs.readFileSync(file, 'utf8');
	mr4Log(code);
	let external = fs.readFileSync(__dirname+'/hackmud-types/hack-types.js', 'utf8');
	mr4Log(external);
	return {
		env:'CUSTOM',
		newTypeInf:true,
		jsCode: [{src:code, path:file}],
		languageIn:'ECMASCRIPT6',
		languageOut:'ECMASCRIPT6',
		externs: [{src:external, path:dirname(file)+'/hack-types.js'}],
		assumeFunctionWrapper:true,
		compilationLevel:'SIMPLE',
		processCommonJsModules:true,
		warningLevel:'VERBOSE'
	};
}
/*

import chalk from 'chalk';

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



const writeCb = (basename: string, err: any) => {
    if (err) {
        console.log(`Error writing ${basename}`, err)
    }
}
*/

//Just a few more simple translations and were done!
const muddify = (code:string) =>replaceInStrIfScriptor('\\\$', '#', code).replace("'use strict';", '').replace('_(', '(');

/**
 * Compiles the code and transforms it into a form hackmud can understand.
 * @todo Fix compile errors.
 */
export async function compile(program: MuddleArgs, filename: string, basename: string):Promise<void> {
	let baseDir = dirname(filename);
	if(filename.endsWith('.ts')){
		filename = baseDir+'/'+basename+'.temp.js';
	}
	let code = fs.readFileSync(filename, 'utf8');
	let compiled = minify(code, {
		warnings:true,
		ecma: 6,
		compress: {
			unsafe: true,
			unsafe_arrows: true,
			unsafe_math: true
		}
	});

	let compiledCode = compiled.code;


	if(filename.endsWith('.temp.js')) {
		fs.unlink(filename, (err)=>{});
	}

	return new Promise<void>((resolve, reject)=>{
		fs.writeFile(`${baseDir}/${basename}_mud.js`, muddify(compiledCode), 'utf8', (err)=>{
			if(err) {
				reject(err);
			}
			else {
				resolve();
			}
		});
	});
}
