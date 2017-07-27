const config = require('../../config');
const nodemon = require('gulp-nodemon');

module.exports = {
    deps: ['build:server'],
    fn: function(gulp) {
        nodemon({
            script: config.src.serv.output.path + config.src.serv.output.name,
            watch: [
                config.src.serv.output.path,
                config.src.shared.output.path
            ]
        });
        return gulp.watch([
            config.src.serv.path + '/**/*.js',
            config.src.shared.path + '/**/*.js'
        ],
        ['build:server:no-clean']);
    }
};