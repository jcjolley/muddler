# Muddler
Transpile, Unit Test, and Minify your [hackmud](https://www.hackmud.com/) scripts ([TypeScript](https://www.typescriptlang.org/) or [JavaScript](https://www.javascript.com/)) with ease.
Works with hackmud [version 1.4.10](https://hackmud.zendesk.com/hc/en-us/articles/115002750533-1-4-10-Patch-Notes)

## [Changelog](https://github.com/jcjolley/muddler/blob/master/CHANGELOG.md) - most recent entry

<div style="border: 1px solid grey; padding: 20px">

### [1.5.0](https://github.com/jcjolley/muddler/compare/v1.4.0...v1.5.0) - 2017-10-25
#### Added
- TypeScript testing support!  You can now write .test.ts files instead of test.js files. [#2](https://github.com/jcjolley/muddler/issues/2)
- Added '-t' option to specify a testing directory.  [#1](https://github.com/jcjolley/muddler/issues/1)
- Added '-R' option to specify a custom mocha reporter

#### Fixed
- Temp files are now removed like they should be.
- Temp files are now created in the same directory as the source script, to make unit testing easier.  [#3](https://github.com/jcjolley/muddler/issues/3)
- -V option returns the correct version now. [#4](https://github.com/jcjolley/muddler/issues/4)
- Mocha was caching testing results and returning false positives.  We now run Mocha in a child process, and errors are reported as expected.

#### Changed
- We all needed a little more Nyan in our lives.
- Debounced testing while watching to 2000ms per file so transpiled ts files don't triggler double muddling.
- Modifying a test while watching re-runs the target file. [#5](https://github.com/jcjolley/muddler/issues/5)

Full changelog can be found [here](https://github.com/jcjolley/muddler/blob/master/CHANGELOG.md)

</div>

## Installation

`npm install muddler -g`

## Usage

```
    -V, --version                output the version number
    -o, --out-file <filename>    the name of the output file
    -w, --watch                  watch the current directory for changes
    -W, --watch-dir <directory>  watch the provided directory for changes
    -d, --out-dir <directory>    what directory to save files to
    -c, --config <filename>      the location of your config file (defaults to muddle.json in the current directory)
    -v, --verbose                increase program verbosity. Good for debugging, or checking for sneaky hacks.
    -q, --quiet                  disable all program output
    -s, --skip-tests             skip tests if they exist
    -t, --test-dir <directory>   the directory to search for tests.
    -R, --reporter <reporter>    Pass this in if you want to use a different mocha test reporter
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
**[New Feature]** If you don't want to clutter up your scripts folder with tests, you can now create a `test` directory to store your tests in.  You still need to follow the `<filename>.test.(t|j)s` naming convention.  Don't like the 'test' dir?  Add -t and specify your own test folder name

If you wish to unit test your files, create a test file with the same name as your script, but with an extension of .test.js.
~~I'll hopefully add support for writing tests in TypeScript someday, but today is not that day.~~ Done.
Write unit tests as you normally would for Mocha, with the following exceptions:
* anywhere you would use '#', use '$' instead.
* at the top of your file add `const window = {}`
* to call the main function in your script, call `muddled(context, args)`
* remember that you're going to have to mock context, args, $fs.scripts.lib(), etc.. 

See [sample.test.ts](https://github.com/jcjolley/muddle/blob/master/examples/sample.test.ts) for simple example of testing

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
