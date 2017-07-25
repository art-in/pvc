const config = require('../config');
const nodemon = require('gulp-nodemon');

module.exports = {
    deps: ['build'],
    fn: function(gulp) {
        nodemon({
            script: config.src.serv.output.path + config.src.serv.output.name,
            watch: false
        });
    }
};