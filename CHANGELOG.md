# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.5.0] - 2017-10-25
### Added
- TypeScript testing support!  You can now write .test.ts files instead of test.js files.  
- Added '-t' option to specify a testing directory

### Fixed
- Temp files are now removed like they should be
- Temp files are now created in the same directory as the source script, to make unit testing easier.  
- -V option returns the correct version now
- Mocha was caching testing results and returning false positives.  We now run Mocha in a child process, and errors are reported as expected

### Changed
- We all needed a little more Nyan in our lives.
- Debounced testing while watching to 2000ms per file so transpiled ts files don't triggler double muddling

## [1.4.0] - 2017-10-23
### Added
- Support for 'test' directory (must be in the directory you call muddle in).  Tests still need to follow the `<filename>.test.js` format

### Changed
- Moved from manual IIFE and AMD modules to regular TS syntax and compiling to commonjs modules.  I was an idiot.  I've seen the light.
- Added a create-externs.ts to generate a much more comprehensive externs.js file
- Broke a few things into smaller functions

### Fixed
- Bug where tests not in the cwd weren't being picked up by muddle.


[All changes](https://github.com/jcjolley/muddler/compare/v1.3.5...v1.4.0)

[Unreleased]: https://github.com/jcjolley/muddler/compare/v1.5.0...HEAD
[1.5.0]: https://github.com/jcjolley/muddler/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/jcjolley/muddler/compare/v1.3.5...v1.4.0