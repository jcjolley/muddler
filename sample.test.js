require("chai").should()
const fs = require('fs');
const window = {};
const code = fs.readFileSync('sample.temp.js', 'utf8').toString()
eval(code);

const log_box = [];
$fs = {
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
            log_box.length.should.equal(1)
        })
    })
})