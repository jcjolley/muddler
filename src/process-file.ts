import { muddleStr, getOutFilename } from './utils';
import { transpile } from './transpile';
import { test } from './testing'
import { compile } from './closure'

export async function processFile(program, filename) {
    if (!program.quiet)
        console.log(muddleStr('Muddling'), filename);

    const basename = getOutFilename(program, filename);

    transpile(program, filename, basename)

    const failed = await test(program, filename, basename)

    if (failed <= 0) {
        await compile(program, basename)
    }
}
