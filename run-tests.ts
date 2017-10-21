const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const testFile = (filename, reporter) => {
    if (filename.includes('.test.js')) {
        const output = [];
        const mocha = new Mocha({reporter: reporter});
        mocha.addFile(filename);


        return new Promise((resolve, reject) =>
            mocha.run(failures => {
                resolve(failures);
            })
        )
    }
};

module.exports = {
    testFile
}
