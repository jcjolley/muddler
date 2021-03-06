"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const utils_1 = require("./utils");
const path = require("path");
const fs = require("fs");
const pjson = require('../package.json');
function parseArgs() {
    program.version(pjson.version)
        .usage('[options] <file to muddle>')
        .option('-o, --out-file <filename>', 'the name of the output file')
        .option('-w, --watch', 'watch the current directory for changes')
        .option('-W, --watch-dir <directory>', 'watch the provided directory for changes')
        .option('-d, --out-dir <directory>', 'what directory to save files to')
        .option('-c, --config <filename>', 'the location of your config file (defaults to muddle.json in the current directory)')
        .option('-v, --verbose', 'increase program verbosity. Good for debugging, or checking for sneaky hacks.')
        .option('-q, --quiet', 'disable all program output')
        .option('-s, --skip-tests', 'skip tests if they exist')
        .option('-t, --test-dir <directory>', 'the directory to search for tests.')
        .option('-R, --reporter <reporter>', 'Pass this in if you want to use a different mocha test reporter')
        .parse(process.argv);
    if (program.verbose && program.quiet) {
        console.log("Be quiet, AND be verbose, eh?  You're " + utils_1.muddleStr('drunk') + ".  Go home.");
        process.exit(1);
    }
    const configFilename = program.config ? path.normalize(program.config) : path.join(process.cwd(), 'muddle.json');
    if (fs.existsSync(configFilename)) {
        const config = JSON.parse(fs.readFileSync(configFilename, 'utf8'));
        const settings = Object.assign({}, config, program);
        return settings;
    }
    return program;
}
exports.parseArgs = parseArgs;
