const getPackConfig = require('../../packer').getPackConfig;
const config = require('../../../config');

module.exports = () =>
    getPackConfig({
        root: [
            // to explicitly import src/test modules from tests.
            // eg. when importing 'utils' it is not clear
            // whether its source utils or test utils. better
            // use explicit notation 'src/utils' or 'test/utils'
            config.path,

            // for src-modules internal references to work
            config.src.path
        ],
        output: {
            path: config.test.unit.output.path,
            urlPath: '/',
            name: config.test.unit.output.name
        }
    });