#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const ClosureCompiler = require('google-closure-compiler').compiler;

program.version('0.1.0')
       .usage('[options] <file to muddle>')
       .option('-o, --outfile [value]', 'The name of the output file' )
       .parse(process.argv)

console.log ("outfile:", program.outfile)
console.log('args: ', program.args)
const filename = program.args[0]

const replaceInStr = (a, b, str) => 
    str.split('\n')
       .map(line => line.replace(new RegExp(a, "g"), b))
       .join('\n');

const nameFirstFunction = str => "window['JolleysMinifier']=" + str
const anonymizeFirstFunction = str => str.replace(/^.*=f/, "f")

const infile = fs.readFileSync(filename, 'utf8')
const outfile = nameFirstFunction(replaceInStr('#', '$', infile))
console.log("Before closure: ", outfile)
fs.writeFileSync("temp.js", outfile)

const compiler = new ClosureCompiler({
    js: "temp.js",
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    language_in: 'ECMASCRIPT6',
    language_out: 'ECMASCRIPT6',
    externs: __dirname + '/externs.js',
    warning_level: 'QUIET',
})


compiler.run((exitCode, stdOut, stdErr) => {
    console.log("Closure Output:", JSON.stringify(stdOut))
    const out = anonymizeFirstFunction(replaceInStr('\\\$', '#', stdOut)).slice(0, -2)
    fs.writeFileSync(program.outfile || "min.js", out)

    console.error(stdErr);
})
