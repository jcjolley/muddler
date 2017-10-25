"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const ClosureCompiler = require('google-closure-compiler').compiler;
const fs = require("fs");
const utils_1 = require("./utils");
const getCompiler = (filename) => new ClosureCompiler({
    js: `${filename.slice(0, -3)}.temp.js`,
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
            report(program, stdErr, basename);
            utils_1.cleanup(filename);
            resolve(out);
        });
    });
};
const restoreHackmud = stdOut => utils_1.anonymizeFirstFunction(utils_1.replaceInStrIfScriptor('\\\$', '#', stdOut))
    .slice(0, -2);
const report = (program, stdErr, filename) => {
    const filteredStdErr = filterStdErr(stdErr);
    if (filteredStdErr) {
        const separator = "\n==========================================\n";
        console.error(separator + chalk_1.default.red(filteredStdErr) + separator);
    }
    else if (!program.quiet) {
        console.log(chalk_1.default.green(`Success`) + ' - ' + chalk_1.default.italic(`${filename}_mud.js`));
    }
};
const writeCb = basename => err => {
    if (err) {
        console.log(`Error writing ${basename}`, err);
    }
};
function compile(program, filename, basename) {
    return __awaiter(this, void 0, void 0, function* () {
        const compiler = getCompiler(filename);
        const out = yield minify(program, compiler, filename, basename);
        fs.writeFileSync(`${basename}_mud.js`, out, 'utf8');
    });
}
exports.compile = compile;
