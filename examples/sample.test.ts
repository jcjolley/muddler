import chai = require("chai")
const should = chai.should();

const fs = require('fs');
declare var muddled: Function;

const window = {};
                                                                          
const code = fs.readFileSync('examples/sample.temp.js', 'utf8').toString()
eval(code);

const log_box = [];
const $fs = {
    scripts: {
        lib: () => { 
            return {
                log: x => log_box.push(x),
                get_log: () => log_box
            }
        }
    }
}


describe('Sample', () => {
    describe('log', () => {
        it('should add an item to the log', () => {
            const res = muddled()
            log_box.length.should.be.above(0)
            log_box[0].should.equal('testing')
        })
    })
})