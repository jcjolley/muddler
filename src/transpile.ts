import fs = require('fs');
import path = require('path');
import ts = require('typescript');

import { MuddleArgs } from './cli';
import { replaceInStrIfScriptor } from './utils';

const config = {
    "compilerOptions": {
        "target": "es6",
        "module": "ES2015",
        "outDir": "dist",
        "moduleResolution": "node",
        "lib": ["es7"],
        "declaration": false,
        "sourceMap": false,
        "removeComments": false,
        "isolatedModules": false,
        "strict": false,
        "noImplicitAny": false,
        "skipLibCheck": true
    }
}

const nameFirstFunction = (str: string) => str.replace(/^.*\(/, "function muddled(");
const addToGlobal = (str: string) => str + '\nwindow["muddled"] = muddled;';

const prepareCode = (code: string) =>
    addToGlobal(
        nameFirstFunction(
            replaceInStrIfScriptor('#', '$', code)));

export function transpile(program: MuddleArgs, filename: string) {
    const fileStr = fs.readFileSync(filename, 'utf8');
    let preparedCode = prepareCode(fileStr)

    const ext = path.extname(filename);
    if (ext === '.ts')
        preparedCode = ts.transpileModule(preparedCode, config as any).outputText;

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
