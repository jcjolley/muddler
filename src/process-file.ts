import { muddleStr, getOutFilename } from './utils';
import { transpile } from './transpile';
import { test } from './testing';
import { compile } from './closure';
import { MuddleArgs } from './cli';

export async function processFile(program:MuddleArgs, filename:string): Promise<void> {
    if (!program.quiet)
        console.log(muddleStr('Muddling'), filename);

    const basename = getOutFilename(program, filename);

    transpile(program, filename);

    const failed = await test(program, filename, basename);
	
    if (failed <= 0) {
        await compile(program, filename, basename);
    }
}
