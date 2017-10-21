#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');
const ClosureCompiler = require('google-closure-compiler').compiler;
const ts = require('typescript');
const tsconfig = require('./tsconfig.json');
const rm = require('rimraf');
const watch = require('watch');
let isFirstWatchRun = true;
const parseArgs = () => {
    program.version('0.1.0')
        .usage('[options] <file to muddle>')
        .option('-o, --out-file <filename>', 'the name of the output file')
        .option('-w, --watch', 'watch the current directory for changes')
        .option('-W, --watch-dir <directory>', 'watch the provided directory for changes')
        .option('-d, --out-dir <directory>', 'what directory to save files to')
        .option('-v, --verbose', 'increase program verbosity. Good for debugging, or checking for sneaky hacks.')
        .option('-q, --quiet', 'disable all program output', )
        .parse(process.argv);

    if (program.verbose && program.quiet) {
        console.log("Be quiet, AND be verbose, eh?  You're drunk.  Go home.")
        process.exit(1);
    }
}

const replaceInStr = (a, b, str) => str.split('\n')
    .map(line => line.replace(new RegExp(a, "g"), b))
    .join('\n');

const prepareTs = filename => {
    tsconfig.compilerOptions.module = 'ES2015';
    const fileStr = fs.readFileSync(filename, 'utf8');
    let preparedTs = nameFirstFunction(replaceInStr('#', '$', fileStr));
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

const nameFirstFunction = str => "window['JolleysMinifier']=" + str;

const anonymizeFirstFunction = str => str.replace(/^.*=f/, "f");

const prepareJs = filename => {
    const fileStr = fs.readFileSync(filename, 'utf8');
    const preparedJs = nameFirstFunction(replaceInStr('#', '$', fileStr));
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

    const out = anonymizeFirstFunction(replaceInStr('\\\$', '#', stdOut)).slice(0, -2);
    fs.writeFileSync(`${filename}_mud.js`, out);
    const filteredStdErr = filterStdErr(stdErr);

    if (filteredStdErr) {
        console.error(filteredStdErr);
    } else if (!program.quiet) {
        console.log(`Success! ${filename} has been muddled. Happy hacking`);
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

            const rejects = ['_mud.js', '.temp.js', 'muddle.ts', 'muddle.js', 'externs.js'];
            const reject = rejects.some(x => filename.includes(x));

            return !reject;
        },
        ignoreUnreadableDir: true,
        ignoreNotPermitted: true,
    };

    const dir = program.watchDir ? path.normalize(program.watchDir) : __dirname;

    if (!program.quiet)
        console.log(`Watching ${dir} for TypeScript/JavaScript files`);
        
    watch.watchTree(dir, options, (f, c, p) => {
        if (isFirstWatchRun) {
            isFirstWatchRun = false;
            const files = Object.keys(f).slice(1);
            files.forEach(processFile);
        } else if (c.nlink !== 0) {
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

const processFile = (filename) => {
    if (!program.quiet)
        console.log('Muddling', filename);
    const ext = path.extname(filename);
    (ext === '.ts') ? prepareTs(filename) : prepareJs(filename);
    const basename = getOutFilename(filename);
    const compiler = getCompiler(basename);
    minifyAndWrite(compiler, basename);
};

function main() {
    parseArgs();
    if (program.watch || program.watchDir) {
        setupWatch();
    }
    else {
        let filename = program.args[0];
        processFile(filename);
    }
}
main();
