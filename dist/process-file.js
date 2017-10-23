var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = (function () {
    const { muddleStr, getOutFilename } = require('./utils');
    const transpile = require('./transpile');
    const test = require('./testing');
    const compile = require('./closure');
    return function processFile(program, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!program.quiet)
                console.log(muddleStr('Muddling'), filename);
            const basename = getOutFilename(program, filename);
            transpile(program, filename, basename);
            const failed = yield test(program, filename, basename);
            if (!failed) {
                yield compile(program, basename);
            }
        });
    };
})();
