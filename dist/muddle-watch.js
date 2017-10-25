"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const watch = require("watch");
const chalk_1 = require("chalk");
const path = require("path");
const fs = require("fs");
const utils_1 = require("./utils");
let recentlySeen = [];
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
    const rejects = ['_mud.js', '.temp.js', 'muddle.ts', 'muddle.js', 'externs.js', 'run-tests'];
    const reject = rejects.some(x => filename.includes(x));
    return !reject;
};
const processOrTrigger = (program, processFile) => file => {
    if (file.includes('.test.') && !recentlySeen.includes(file)) {
        recentlySeen.includes(file);
        setTimeout(() => recentlySeen.filter(f => f !== file), 2000);
        let filename = file.slice(0, -8);
        let jsfile = `${filename}.js`;
        if (fs.existsSync(jsfile)) {
            processFile(program, jsfile);
        }
        let tsfile = `${filename}.ts`;
        if (fs.existsSync(tsfile)) {
            processFile(program, tsfile);
        }
    }
    else {
        processFile(program, file);
    }
};
const getWatchFn = (program, processFile) => (f, c, p) => {
    if (typeof f === 'object') {
        const files = Object.keys(f).slice(1);
        files.forEach(file => {
            if (!file.includes('.test.'))
                processFile(program, file);
        });
    }
    else if (c.nlink !== 0) {
        processOrTrigger(program, processFile)(f);
    }
};
const testWatchFn = (program, dir, processFile) => (f, c, p) => {
    if (typeof f !== 'object' && c.nlink !== 0 && f.includes('.test.') && !recentlySeen.includes(f)) {
        recentlySeen.includes(f);
        setTimeout(() => recentlySeen.filter(file => file !== f), 2000);
        const basename = f.slice(0, -8);
        let newfilename = path.join(dir, basename);
        if (fs.existsSync(`${newfilename}.ts`)) {
            processFile(program, `${newfilename}.ts`);
        }
        if (fs.existsSync(`${newfilename}.js`)) {
            processFile(program, `${newfilename}.js`);
        }
    }
};
function setupWatch(program, processFile) {
    const dir = program.watchDir ? path.normalize(program.watchDir) : process.cwd();
    const options = getWatchOptions();
    if (!program.quiet)
        console.log(chalk_1.default.cyan(`\nWatching ${dir}\n`));
    watch.watchTree(dir, options, getWatchFn(program, processFile));
    if (program.testDir && !utils_1.isChildOf(program.testDir, dir))
        watch.watchTree(program.testDir, options, testWatchFn(program, dir, processFile));
}
exports.setupWatch = setupWatch;
;
