const config = require('../../config');
const del = require('del');

module.exports = {
    fn: function() {
        return del(config.src.client.output.path, {force: true});
    }
};