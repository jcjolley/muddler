# Muddler
Transpile, Unit Test, and Minify your [hackmud](https://www.hackmud.com/) scripts ([TypeScript](https://www.typescriptlang.org/) or [JavaScript](https://www.javascript.com/)) with ease.
Works with hackmud [version 1.4.10](https://hackmud.zendesk.com/hc/en-us/articles/115002750533-1-4-10-Patch-Notes)

## Changelog
### [Unreleased]

### [1.4.0] - 2017-10-23
#### Added
- Support for 'test' directory (must be in the directory you call muddle in).  Tests still need to follow the `<filename>.test.js` format

#### Changed
- Moved from manual IIFE and AMD modules to regular TS syntax and compiling to commonjs modules.  I was an idiot.  I've seen the light.
- Added a create-externs.ts to generate a much more comprehensive externs.js file
- Broke a few things into smaller functions

#### Fixed
- Bug where tests not in the cwd weren't being picked up by muddle.

[All changes this version](https://github.com/jcjolley/muddler/compare/v1.3.5...v1.4.0)
Full changelog can be found [here](https://github.com/jcjolley/muddler/blob/master/CHANGELOG.md)
[Unreleased]: https://github.com/jcjolley/muddler/compare/v1.4.0...HEAD

## Prerequisites 
This project requires [Java 7+](http://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) and [Google's Closure Compiler](https://dl.google.com/closure-compiler/compiler-latest.zip) on your [PATH](http://windowsitpro.com/systems-management/how-can-i-add-new-folder-my-system-path) to function.

## Installation

`npm install muddler -g`

## Usage

```
 Usage: muddle [options] <file to muddle>

  Options:

    -V, --version                output the version number
    -o, --out-file <filename>    the name of the output file
    -w, --watch                  watch the current directory for changes
    -W, --watch-dir <directory>  watch the provided directory for changes
    -d, --out-dir <directory>    what directory to save files to
    -v, --verbose                increase program verbosity. Good for debugging, or checking for sneaky hacks.
    -q, --quiet                  disable all program output
    -s, --skip-tests             skip tests if they exist
    -h, --help                   output usage information

```

Examples:

`muddle -W C:\dev\hackmud -d C:\User\1337H4x0r\AppData\Roaming\hackmud\1337H4x0r\scripts`

This will watch C:\dev\hackmud for changes to *.ts and *.js files, run any *.test.js files, and then write *_mud.js files to your hackmud folder.
I think this is the most useful option.

`muddle`

This will watch the current working directory for changes to *.ts and *.js files, run any *.test and write *_mud.js files to the current directory.

`muddle <filename>`

This will test \<filename\>.test.js, and then write a minified \<filename\>_mud.js to the current directory.

## Testing
If you wish to unit test your files, create a test file with the same name as your script, but with an extension of .test.js.
I'll hopefully add support for writing tests in TypeScript someday, but today is not that day.
Write unit tests as you normally would for Mocha, with the following exceptions:
* anywhere you would use '#', use '$' instead.
* at the top of your file add `const window = {}`
* to call the main function in your script, call `muddled(context, args)`
* remember that you're going to have to mock context, args, $fs.scripts.lib(), etc.. 

See [sample.test.js](https://github.com/jcjolley/muddle/blob/master/sample.test.js) for simple example of testing

## Config file
Create a `muddle.json` file in your development directory (!!not AppData/hackmud/user/scripts !!) muddle your life.
The available settings are the options for the program, but camelCased instead of kebab-cased.
e.g.
```
{
  "watchDir": "C:\dev\hackmud" 
  "outDir": "C:\User\1337H4x0r\AppData\Roaming\hackmud\1337H4x0r\scripts"
}
```

## Caveats
* The Clojure Compiler (v20170910) is still working to support all of es6.  One thing they do NOT support yet is array destructuring.  You'll have to manually edit your script to rename your variables to non-clashing variables if you use destructuring.  
* If you wish to preserve your object property names, provide them as strings.
* I haven't tested this with scripts that use the DB.  If you run into problems, please make an issue on the github repo and I'll fix it asap.
* For now, if you want to do testing, you have to save the test files in the same folder as your .ts/.js scripts.  

## Credits
This project was inspired by [Gerow's Mudify](https://github.com/gerow/mudify). (@gerow on hackmud).
The testing portion of the project was blatantly stolen from [Jer0ge's hackmud-unit-poc](https://github.com/jer0ge/hackmud-unit-poc).

I'm typically playing as @s1mply_me on [hackmud](https://www.hackmud.com/) go by Jolley in the [Discord channel](https://discord.gg/sc6gVse)
Feel free to hit me up (or even send some sweet sweet GC my way ;) ).

## What's next?

So, you've got a muddler, but no scripts to muddle?  Get started scripting with [this excellent guide](https://docs.google.com/document/d/1eXAmHrQ9pqBGoT183LQ4O0WsAaNiKML8GOxZNEy5O3w/edit) by @ciastex_ and @i20k.
