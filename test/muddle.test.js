const should = require("chai").should()
const fs = require('fs')
const rm = require('rimraf')
const processFile = require('../dist/process-file');
var promise;

describe('Muddler', () => {
    describe('#processFile', () => {
        before(() => {
            if (fs.existsSync('sample_mud.js')) {
                rm.sync('sample_mud.js')
            }
            promise = processFile({}, 'examples/sample.ts')
        })
        it('should create a sample_mud.js file', async () => {
            await promise;
            fs.existsSync('sample_mud.js').should.equal(true)
        })
        after(() => {
            rm.sync('sample_mud.js')
        })
    })
})