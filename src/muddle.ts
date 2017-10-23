#!/usr/bin/env node

const parseArgs = require('./cli')
const { muddleStr, getOutFilename } = require('./utils');
const transpile = require('./transpile')
const compile = require('./closure')
const setupWatch = require('./muddle-watch')
const test = require('./testing')
const processFile = require('./process-file')

function main() {
    const program = parseArgs();
    let filename = program.args[0];

    if (program.watch || program.watchDir || !filename) {
        setupWatch(program, processFile);
    } else {
        processFile(program, filename);
    }
}
main();
