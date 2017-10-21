# muddle
Transpile and Minify your [hackmud](https://www.hackmud.com/) scripts ( [TypeScript](https://www.typescriptlang.org/) or [JavaScript](https://www.javascript.com/) ) with ease.
Works with hackmud [version 1.4.10](https://hackmud.zendesk.com/hc/en-us/articles/115002750533-1-4-10-Patch-Notes) (10/21/2017)

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
    -h, --help                   output usage information

```

Examples:

`muddle -W C:\dev\hackmud -d C:\User\1337H4x0r\AppData\Roaming\hackmud\1337H4x0r\scripts`

Will watch C:\dev\hackmud for changes to *.ts and *.js files, and then write *_mud.js files to your hackmud folder.
I think this is the most useful option.

`muddle -w`

Will watch the current working directory for changes to *.ts and *.js files and write *_mud.js files to the current directory

## Caveat
* If you wish to preserve your object property names, provide them as strings
* I haven't tested this with scripts that use the DB.  If you run into problems, please make an issue in github and I'll fix it asap.

## Credits
This project was inspired by [Gerow's Mudify](https://github.com/gerow/mudify) which isn't maintained (@gerow on hackmud).

I'm typically playing as @s1mply_me on [hackmud](https://www.hackmud.com/) and am Jolley in the [Discord channel](https://discord.gg/sc6gVse)
Feel free to hit me up (or even send some sweet sweet GC my way ;) )

## What's next?

So, you've got a muddler, but no scripts to muddle?  Get started scripting with [this excellent guide](https://docs.google.com/document/d/1eXAmHrQ9pqBGoT183LQ4O0WsAaNiKML8GOxZNEy5O3w/edit) by @ciastex_ and @i20k.