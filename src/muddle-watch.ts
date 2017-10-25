import watch = require('watch');
import chalk from 'chalk'
import path = require('path');
import fs = require('fs');

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

    const rejects = ['_mud.js', '.temp.js',  'muddle.ts', 'muddle.js', 'externs.js', 'run-tests'];
    const reject = rejects.some(x => filename.includes(x));

    return !reject;
}

const processOrTrigger = (program, processFile) => file => {
    if (file.includes('.test.js')) {
        let filename = file.slice(0, -8);

        let jsfile = `${filename}.js`
        if (fs.existsSync(jsfile)) {
            processFile(program, jsfile)
        }

        let tsfile = `${filename}.ts`
        if (fs.existsSync(tsfile)) {
            processFile(program, tsfile)
        }
    } else {
        processFile(program, file)
    }
}

const getWatchFn = (program, processFile) => (f, c, p) => {
    if (typeof f === 'object') {
        const files = Object.keys(f).slice(1);
        files.forEach(file => {
            if (!file.includes('.test.js')) 
                processFile(program, file)
        });
    } else if (c.nlink !== 0) {
        processOrTrigger(program, processFile)(f)
    }
}

export function setupWatch(program, processFile) {
    const dir = program.watchDir ? path.normalize(program.watchDir) : process.cwd();
    const options = getWatchOptions()

    if (!program.quiet)
        console.log(chalk.cyan(`\nWatching ${dir}\n`));

    watch.watchTree(dir, options, getWatchFn(program, processFile));
    };