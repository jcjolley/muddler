#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs');
const path = require('path');
let program = require('commander');
const ClosureCompiler = require('google-closure-compiler').compiler;
const ts = require('typescript');
const tsconfig = require('../tsconfig.json');
const rm = require('rimraf');
const watch = require('watch');
const testFile = require('./run-tests').testFile;
const silentReporter = require('mocha-silent-reporter');
const chalk = require('chalk');
let isFirstWatchRun = true;
const parseArgs = () => {
    program.version('0.1.0')
        .usage('[options] <file to muddle>')
        .option('-o, --out-file <filename>', 'the name of the output file')
        .option('-w, --watch', 'watch the current directory for changes')
        .option('-W, --watch-dir <directory>', 'watch the provided directory for changes')
        .option('-d, --out-dir <directory>', 'what directory to save files to')
        .option('-c, --config <filename>', 'the location of your config file (defaults to muddle.json in the current directory)')
        .option('-v, --verbose', 'increase program verbosity. Good for debugging, or checking for sneaky hacks.')
        .option('-q, --quiet', 'disable all program output')
        .option('-s, --skip-tests', 'skip tests if they exist')
        .parse(process.argv);
    if (program.verbose && program.quiet) {
        console.log("Be quiet, AND be verbose, eh?  You're " + muddleStr('drunk') + ".  Go home.");
        process.exit(1);
    }
    const configFilename = program.config ? path.normalize(program.config) : path.join(process.cwd(), 'muddle.json');
    if (fs.existsSync(configFilename)) {
        const config = JSON.parse(fs.readFileSync(configFilename, 'utf8'));
        const settings = Object.assign({}, config, program);
        program = settings;
    }
};
const replaceInStrIfScriptor = (a, b, str) => {
    const scriptors = ['s\.', 'fs\.', 'ms\.', 'ls\.', 'ns\.', '4s\.', '3s\.', '2s\.', '1s\.'];
    const lookahead = `(?=${scriptors.join('|')})`;
    return str.split('\n')
        .map(line => line.replace(new RegExp(`${a}${lookahead}`, "g"), b))
        .join('\n');
};
const prepareTs = filename => {
    tsconfig.compilerOptions.module = 'ES2015';
    const fileStr = fs.readFileSync(filename, 'utf8');
    let preparedTs = addToGlobal(nameFirstFunction(replaceInStrIfScriptor('#', '$', fileStr)));
    let js = ts.transpileModule(preparedTs, tsconfig).outputText;
    if (program.verbose)
        console.log("Prepared Js: ", js);
    const outname = getOutFilename(filename);
    fs.writeFileSync(`${outname}.temp.js`, js);
};
const getFilenameSansExt = (filename) => {
    const ext = path.extname(filename);
    return path.basename(filename, ext);
};
const muddleStr = str => {
    const colors = ['blue', 'magenta', 'magentaBright', 'blueBright'];
    return str.split('').map(c => chalk[colors[getRandomInt(0, colors.length)]](c)).join('');
};
const nameFirstFunction = str => str.replace(/^.*\(/, "function muddled(");
const addToGlobal = str => str + '\nwindow["muddled"] = muddled;';
const anonymizeFirstFunction = str => str.replace(/^.*?\(/, "function(");
const prepareJs = filename => {
    const fileStr = fs.readFileSync(filename, 'utf8');
    const preparedJs = addToGlobal(nameFirstFunction(replaceInStrIfScriptor('#', '$', fileStr)));
    if (program.verbose)
        console.log("Prepared Js: ", preparedJs);
    const outname = getOutFilename(filename);
    fs.writeFileSync(`${outname}.temp.js`, preparedJs);
};
const getCompiler = (filename) => new ClosureCompiler({
    js: `${filename}.temp.js`,
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
const minifyAndWrite = (compiler, filename) => compiler.run((exitCode, stdOut, stdErr) => {
    if (program.verbose)
        console.log("Closure Output:", JSON.stringify(stdOut));
    const out = anonymizeFirstFunction(replaceInStrIfScriptor('\\\$', '#', stdOut)).slice(0, -2);
    fs.writeFileSync(`${filename}_mud.js`, out);
    const filteredStdErr = filterStdErr(stdErr);
    if (filteredStdErr) {
        const separator = "\n==========================================\n";
        console.error(separator + chalk.red(filteredStdErr) + separator);
    }
    else if (!program.quiet) {
        console.log(chalk.green(`Success`) + ' - ' + chalk.italic(`${filename}_mud.js`));
    }
    cleanup(filename);
});
const setupWatch = () => {
    const options = {
        filter: (filename) => {
            const ext = path.extname(filename);
            if (ext !== '.ts' && ext !== '.js') {
                return false;
            }
            const rejects = ['_mud.js', '.temp.js', '.test.', 'muddle.ts', 'muddle.js', 'externs.js', 'run-tests'];
            const reject = rejects.some(x => filename.includes(x));
            return !reject;
        },
        ignoreUnreadableDir: true,
        ignoreNotPermitted: true,
    };
    const dir = program.watchDir ? path.normalize(program.watchDir) : process.cwd();
    if (!program.quiet)
        console.log(chalk.cyan(`\nWatching ${dir}\n`));
    watch.watchTree(dir, options, (f, c, p) => {
        if (isFirstWatchRun) {
            isFirstWatchRun = false;
            const files = Object.keys(f).slice(1);
            files.forEach(processFile);
        }
        else if (c.nlink !== 0) {
            processFile(f);
        }
    });
};
const cleanup = (filename) => {
    rm(`${filename}.temp.js`, [], x => x);
};
const getOutFilename = (filename) => {
    let outname = getFilenameSansExt(program.outFile ? program.outFile : filename);
    if (program.outDir)
        return path.normalize(path.join(program.outDir, outname));
    if (program.watchDir)
        return path.normalize(path.join(program.watchDir, outname));
    return outname;
};
const test = (filename) => __awaiter(this, void 0, void 0, function* () {
    if (fs.existsSync(`${filename}.test.js`)) {
        if (!program.quiet)
            console.log(chalk.cyanBright('Testing') + ` - ${filename}.test.js`);
        const reporter = getReporter();
        const failures = yield testFile(`${filename}.test.js`, reporter);
        return failures;
    }
});
const getReporter = () => {
    if (program.verbose)
        return 'spec';
    if (program.quiet)
        return function reporter(runner) { };
    return silentReporter;
};
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
const processFile = (filename) => __awaiter(this, void 0, void 0, function* () {
    if (!program.quiet)
        console.log(muddleStr('Muddling'), filename);
    const ext = path.extname(filename);
    (ext === '.ts') ? prepareTs(filename) : prepareJs(filename);
    const basename = getOutFilename(filename);
    if (!program.skipTests) {
        const numFailures = yield test(basename);
        if (numFailures > 0) {
            console.log(chalk.red(`Failure`) + ' - ' + filename + ` - ` + chalk.bgRed(numFailures) + ` failing test(s)`);
            cleanup(filename);
            return;
        }
    }
    const compiler = getCompiler(basename);
    minifyAndWrite(compiler, basename);
});
function main() {
    parseArgs();
    if (program.watch || program.watchDir || !program.args[0]) {
        setupWatch();
    }
    else {
        let filename = program.args[0];
        processFile(filename);
    }
}
main();
