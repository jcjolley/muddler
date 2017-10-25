"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const transpile_1 = require("./transpile");
const testing_1 = require("./testing");
const closure_1 = require("./closure");
function processFile(program, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!program.quiet)
            console.log(utils_1.muddleStr('Muddling'), filename);
        const basename = utils_1.getOutFilename(program, filename);
        transpile_1.transpile(program, filename);
        const failed = yield testing_1.test(program, filename, basename);
        if (failed <= 0) {
            yield closure_1.compile(program, filename, basename);
        }
    });
}
exports.processFile = processFile;
