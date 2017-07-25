const config = require('../../config');
const nodemon = require('gulp-nodemon');

module.exports = {
    deps: ['build:server'],
    fn: function(gulp) {
        nodemon({
            script: config.src.serv.output.path + config.src.serv.output.name,
            watch: config.src.serv.output.path
        });
        return gulp.watch(config.src.serv.root + '/**/*.js',
            ['build:server:no-clean']);
    }
};