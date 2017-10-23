module.exports = (function () {
    const {muddleStr, getOutFilename} = require('./utils');
    const transpile = require('./transpile');
    const test = require('./testing')
    const compile = require('./closure')

    return async function processFile(program, filename) {
        if (!program.quiet)
            console.log(muddleStr('Muddling'), filename);

        const basename = getOutFilename(program, filename);

        transpile(program, filename, basename)

        const failed = await test(program, filename, basename)

        if (!failed) {
            await compile(program, basename)
        }
    };
})()