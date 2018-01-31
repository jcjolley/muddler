import 'mocha';

import { MuddleArgs } from '../cli';
import { processFile } from '../process-file';
import { existsSync, unlinkSync, unlink } from 'fs';

import chai = require('chai');

const assert = chai.assert;

describe('Muddler', () => {
    describe('#processFile', () => {
        before(() => {
			try {
				unlinkSync('sample_mud.js');
			}
			catch(err) { }
		});
		
        it('should create a sample_mud.js file', async function(done) {
            this.timeout(0); //?
            await processFile({} as MuddleArgs, 'examples/sample.ts');
			assert.isTrue(existsSync('sample_mud.js'))
        });
        after(() => {
            unlink('sample_mud.js', (err)=>{});
        })
    })
})