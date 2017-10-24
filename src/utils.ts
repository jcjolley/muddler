import chalk from 'chalk'
import rm = require('rimraf')
import path = require('path')

export const cleanup = (filename) => {
    rm(`${filename}.temp.js`, [], x => x);
};

export const muddleStr = str => {
    const colors = ['blue', 'magenta', 'magentaBright', 'blueBright']
    return str.split('').map(c => chalk[colors[getRandomInt(0, colors.length)]](c)).join('')
}

export const getOutFilename = (program, filename) => {
    let outname = getFilenameSansExt(program.outFile ? program.outFile : filename);
    if (program.outDir)
        return path.normalize(path.join(program.outDir, outname));
    if (program.watchDir)
        return path.normalize(path.join(program.watchDir, outname));
    return outname;
};

export const replaceInStrIfScriptor = (a, b, str) => {
    const scriptors = ['s\.', 'fs\.', 'ms\.', 'ls\.', 'ns\.', '4s\.', '3s\.', '2s\.', '1s\.']
    const lookahead = `(?=${scriptors.join('|')})`
    return str.split('\n')
        .map(line => line.replace(new RegExp(`${a}${lookahead}`, "g"), b))
        .join('\n');
}

export const anonymizeFirstFunction = str => str.replace(/^.*?\(/, "function(");

const getFilenameSansExt = (filename) => {
    const ext = path.extname(filename);
    return path.basename(filename, ext);
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}