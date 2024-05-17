import chalk from 'chalk';
import rm = require('rimraf');
import path = require('path');
import { MuddleArgs } from './cli';

export const cleanup = (filename:string): void => {
	//No need to wait for deletion of the file. Just delete and swallow.
	rm(`${filename.slice(0,-3)}.temp.js`, (err)=>{});
};

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export const muddleStr = (str: string) => {
	//[blue, magenta, magenta-bright, blue-bright] as ANSI escape codes. 
	const colors = ['\u001b[34m', '\u001b[35m', '\u001b[35;1m', '\u001b[34;1m'];
	
	//Splits string into individual characters and adds Colors using ANSI escape codes.
    return str.split('').map(c => colors[getRandomInt(0, colors.length)]+c).join('')+'\u001b[0m';
}

export const getOutFilename = (program:MuddleArgs, filename:string): string => {
    let outname = getFilenameSansExt(program.outFile ? program.outFile : filename);
    if (program.outDir)
        return path.normalize(path.join(program.outDir, outname));
    if (program.watchDir)
        return path.normalize(path.join(program.watchDir, outname));
    return outname;
};

export const replaceInStrIfScriptor = (a: string, b: string, str: string) => {
    const scriptors = ['s\.', 'db\.', 'fs\.', 'ms\.', 'ls\.', 'ns\.', '4s\.', '3s\.', '2s\.', '1s\.']
    const lookahead = `(?=${scriptors.join('|')})`
    return str.split('\n')
        .map(line => line.replace(new RegExp(`${a}${lookahead}`, 'g'), b))
        .join('\n');
}

export const anonymizeFirstFunction = (str: string) => str.replace(/^.*?\(/, "function(");

export const isChildOf = (child: string, parent: string) => {
    const c = path.resolve(child);
    const p = path.resolve(parent);
    return (c !== p) && p.split(path.sep).every((t, i) => c.split(path.sep)[i] === t);
}

const getFilenameSansExt = (filename: string) => {
    const ext = path.extname(filename);
    return path.basename(filename, ext);
};
