import * as ts from 'typescript'
import { replaceInStrIfScriptor } from './utils'
import path = require('path')
import fs = require('fs')

const config = {
    "compilerOptions": {
        "target": "es6",
        "module": "ES2015",
        "outDir": "dist",
        "moduleResolution": "node",
        "lib": ["es7", "dom"],
        "declaration": false,
        "sourceMap": false,
        "removeComments": true,
        "isolatedModules": false,
        "strict": false,
        "noImplicitAny": false,
        "skipLibCheck": true
    }
}

const nameFirstFunction = str => str.replace(/^.*\(/, "function muddled(");
const addToGlobal = str => str + '\nwindow["muddled"] = muddled;';

const prepareCode = (code) =>
    addToGlobal(
        nameFirstFunction(
            replaceInStrIfScriptor('#', '$', code)));

export function transpile(program, filename, outFilename) {
    const fileStr = fs.readFileSync(filename, 'utf8');
    let preparedCode = prepareCode(fileStr)

    const ext = path.extname(filename);
    if (ext === '.ts')
        preparedCode = ts.transpileModule(preparedCode, config as any).outputText;

    if (program.verbose)
        console.log("Prepared Js: ", preparedCode);

    fs.writeFileSync(`${outFilename}.temp.js`, preparedCode);
}
