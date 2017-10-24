#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("./cli");
const muddle_watch_1 = require("./muddle-watch");
const process_file_1 = require("./process-file");
function main() {
    const program = cli_1.parseArgs();
    let filename = program.args[0];
    if (program.watch || program.watchDir || !filename) {
        muddle_watch_1.setupWatch(program, process_file_1.processFile);
    }
    else {
        process_file_1.processFile(program, filename);
    }
}
main();
