const babel = require('gulp-babel');
const config = require('../../../../config');

module.exports = {
    deps: [
        'build:server:no-clean:shared',
        'build:server:no-clean:static'
    ],
    fn: gulp =>
        gulp.src(config.src.serv.path + '/**/*.js')
            .pipe(babel())
            .pipe(gulp.dest(config.src.serv.output.path))
};