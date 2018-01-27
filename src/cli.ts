import program = require('commander');
import { muddleStr } from './utils';
import path = require('path');
import fs = require('fs');
const pjson = require('../package.json');

export interface MuddleArgs {
	args:string[];
	outFile?:string;
	watch?:boolean;
	watchDir?:string;
	outDir?:string;
	config?:string;
	verbose?:boolean;
	quiet?:boolean;
	testDir?:string;
	reporter?:string;
	skipTests?:boolean;
}

export function parseArgs(): MuddleArgs {
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
        .option('-R, --reporter <reporter>',  'Pass this in if you want to use a different mocha test reporter')

        .parse(process.argv);

	//We need to wrap the arguments into something that can be read via type.
	//Luckely we can just cast it's type to MuddleArgs as it has the exact same typings as the raw program.
	let args:MuddleArgs = program as MuddleArgs;
	
    if (args.verbose && args.quiet) {
        console.log(`Be quiet, AND be verbose, eh?  You're ${muddleStr('drunk')}.  Go home.`);
        process.exit(1);
    }

    const configFilename = program.config ? path.normalize(program.config) : path.join(process.cwd(), 'muddle.json')

	/*
	 * Why access the file first then catch the an exception if it dosen't exist?
	 * Well checking for existance before opening a file is an antipattern.
	 * Code takes time to execute so the time between fs.existsSync and require(configFilename) it could be deleted by another process.
	 * Thus lo and behold, you get an exception.
	 * So instead of relying on the fs.existsSync, if it exists, you get the data without having to do another call and worse case scenerio you have to catch an exception which isn't computationally expensive on it's own.
	 */
	try {
		const config = require(configFilename);
        const settings = { ...config, ...program };
        return settings as MuddleArgs;
	}
	catch(err) {
		return args;
	}
}