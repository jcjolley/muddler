import fs = require('fs');
import path = require('path');
import ts = require('typescript');

import { MuddleArgs } from './cli';
import { replaceInStrIfScriptor } from './utils';


const config:ts.TranspileOptions = {
	compilerOptions:{
		target:ts.ScriptTarget.ES2015,
		module:ts.ModuleKind.ES2015,
		outDir:'dist',
		moduleResolution:ts.ModuleResolutionKind.NodeJs,
		lib:['es7'],
		declaration:false,
		sourceMap:false,
		removeComments:false,
		isolatedModules:false,
		strict:false,
		noImplicitAny:false,
		skipLibCheck:false
	}
}
const nameFirstFunction = (str: string) => str.replace(/^.*\(/, "function _(");
const removeImports = (str: string) => str.replace(/import .+[;\n\r]/g, '');

const prepareCode = (code: string) =>
removeImports(
	nameFirstFunction(
			replaceInStrIfScriptor('#', '$', code)).replace('./hack-types', './hack-types.js'));

export function transpile(program: MuddleArgs, filename: string) {
    const fileStr = fs.readFileSync(filename, 'utf8');
    let preparedCode = prepareCode(fileStr);

    const ext = path.extname(filename);
    if (ext === '.ts')
        preparedCode = ts.transpileModule(preparedCode, config).outputText;

    if (program.verbose)
        console.log("Prepared Js: ", preparedCode);

    fs.writeFileSync(`${filename.slice(0,-3)}.temp.js`, preparedCode);
}

export function transpileTest(program: MuddleArgs, testFileName: string) {
    const testConfig = {compilerOptions: {...config.compilerOptions, module: 'commonjs'}}
    const fileStr = fs.readFileSync(testFileName, 'utf8');
    const transpiledCode = ts.transpileModule(fileStr, testConfig as any).outputText;
    const preparedCode = transpiledCode.split('\n').slice(1).join('\n') // remove 'use strict'
    fs.writeFileSync(`${testFileName.slice(0,-3)}.js`, preparedCode)
}
