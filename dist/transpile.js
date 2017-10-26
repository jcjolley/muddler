"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const utils_1 = require("./utils");
const path = require("path");
const fs = require("fs");
const config = {
    "compilerOptions": {
        "target": "es6",
        "module": "ES2015",
        "outDir": "dist",
        "moduleResolution": "node",
        "lib": ["es7"],
        "declaration": false,
        "sourceMap": false,
        "removeComments": true,
        "isolatedModules": false,
        "strict": false,
        "noImplicitAny": false,
        "skipLibCheck": true
    }
};
const nameFirstFunction = str => str.replace(/^.*\(/, "function muddled(");
const addToGlobal = str => str + '\nwindow["muddled"] = muddled;';
const prepareCode = (code) => addToGlobal(nameFirstFunction(utils_1.replaceInStrIfScriptor('#', '$', code)));
function transpile(program, filename) {
    const fileStr = fs.readFileSync(filename, 'utf8');
    let preparedCode = prepareCode(fileStr);
    const ext = path.extname(filename);
    if (ext === '.ts')
        preparedCode = ts.transpileModule(preparedCode, config).outputText;
    if (program.verbose)
        console.log("Prepared Js: ", preparedCode);
    fs.writeFileSync(`${filename.slice(0, -3)}.temp.js`, preparedCode);
}
exports.transpile = transpile;
function transpileTest(program, testFileName) {
    const testConfig = { compilerOptions: Object.assign({}, config.compilerOptions, { module: 'commonjs' }) };
    const fileStr = fs.readFileSync(testFileName, 'utf8');
    const transpiledCode = ts.transpileModule(fileStr, testConfig).outputText;
    const preparedCode = transpiledCode.split('\n').slice(1).join('\n');
    fs.writeFileSync(`${testFileName.slice(0, -3)}.js`, preparedCode);
}
exports.transpileTest = transpileTest;
