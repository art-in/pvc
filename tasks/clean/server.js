const config = require('../../config');
const del = require('del');

module.exports = {
    fn: function() {
        return del([
            config.src.serv.output.path,
            config.src.shared.output.path
        ], {force: true});
    }
};