#!/usr/bin/env node

import { parseArgs } from './cli'
import { setupWatch } from './muddle-watch'
import { processFile } from './process-file'

function main():void {
    const program = parseArgs();
    let filename = program.args[0];

    if (program.watch || program.watchDir || !filename) {
        setupWatch(program, processFile);
    } else {
        processFile(program, filename);
    }
}
main();
