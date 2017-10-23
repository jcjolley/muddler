
module.exports = (function () {

    return async function processFile(program, filename) {
        if (!program.quiet)
            console.log(muddleStr('Muddling'), filename);

        const basename = getOutFilename(program, filename);

        transpile(program, filename, basename)

        const failed = await test(program, filename, basename)

        if (!failed) {
            compile(program, basename)
        }
    };
})()