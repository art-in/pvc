const config = require('../../../config');
const runUnitTests = require('./run-unit-tests');
const getUnitTestPackConfig = require('./get-unit-pack-config');

module.exports = {
    fn: function() {
        return runUnitTests({
            packConfig: getUnitTestPackConfig(),
            entry: config.test.unit.entry,
            watch: true
        });
    }
};