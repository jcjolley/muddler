Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const should = chai.should();
const fs = require('fs');
const window = {};
const code = fs.readFileSync('examples/sample.temp.js', 'utf8').toString();
eval(code);
const log_box = [];
const $fs = {
    scripts: {
        lib: () => {
            return {
                log: x => log_box.push(x),
                get_log: () => log_box
            };
        }
    }
};
let db = [];
const $db = {
    i: (arg) => {
        db.push(arg);
    }
};
describe('Sample', () => {
    describe('log', () => {
        it('should add an item to the log', () => {

			// This represents the main function.
			// Used underscore to represent how it's supposed to be empty (and to survive mangling from UglifyJS)
            const res = _();
            log_box.length.should.be.above(0);
            log_box[0].should.equal('testing');
            db[0]["SID"].should.equal('haxor');
        });
    });
});
