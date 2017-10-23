module.exports = (function () {
    const watch = require('watch');
    const chalk = require('chalk');
    const path = require('path');
    const getWatchOptions = () => {
        return {
            filter: watchFilter,
            ignoreUnreadableDir: true,
            ignoreNotPermitted: true,
        };
    };
    const watchFilter = filename => {
        const ext = path.extname(filename);
        if (ext !== '.ts' && ext !== '.js') {
            return false;
        }
        const rejects = ['_mud.js', '.temp.js', '.test.', 'muddle.ts', 'muddle.js', 'externs.js', 'run-tests'];
        const reject = rejects.some(x => filename.includes(x));
        return !reject;
    };
    const getWatchFn = (program, processFile) => (f, c, p) => {
        if (typeof f === 'object') {
            const files = Object.keys(f).slice(1);
            files.forEach(file => processFile(program, file));
        }
        else if (c.nlink !== 0) {
            processFile(program, f);
        }
    };
    return function setupWatch(program, processFile) {
        const dir = program.watchDir ? path.normalize(program.watchDir) : process.cwd();
        const options = getWatchOptions();
        if (!program.quiet)
            console.log(chalk.cyan(`\nWatching ${dir}\n`));
        watch.watchTree(dir, options, getWatchFn(program, processFile));
    };
})();
