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

//Just a few more simple translations and were done!
const muddify = (code:string) =>replaceInStrIfScriptor('\\\$', '#', code).replace("'use strict';", '').replace('_(', '(');

/**
 * Compiles the code and transforms it into a form hackmud can understand.
 */
export async function compile(program: MuddleArgs, filename: string, basename: string):Promise<void> {
	if(filename.endsWith('.ts')){
		filename = basename+'.temp.js';
	}
	let code = fs.readFileSync(filename, 'utf8');
	let compiled = minify(code, {
		warnings:true,
		ecma: 6,
		compress: {
			unsafe: true,
			unsafe_arrows: true,
			unsafe_math: true
		},
		output: {
			comments: false
		}
	});

	if(compiled.error) {
		console.error(compiled.error);
		return;
	}
	let compiledCode = compiled.code;


	if(filename.endsWith('.temp.js')) {
		fs.unlink(filename, (err)=>{});
	}

	return new Promise<void>((resolve, reject)=>{
		fs.writeFile(`${basename}_mud.js`, muddify(compiledCode), 'utf8', (err)=>{
			if(err) {
				reject(err);
			}
			else {
				resolve();
			}
		});
	});
}
