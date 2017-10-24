# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/jcjolley/muddler/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/jcjolley/muddler/compare/v1.3.5...v1.4.0