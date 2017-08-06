const config = require('../../../../config');

module.exports = {
    fn: gulp =>
        gulp.src(config.src.serv.path + '/**/*.+(json)')
            .pipe(gulp.dest(config.src.serv.output.path))
};