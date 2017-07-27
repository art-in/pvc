const babel = require('gulp-babel');
const config = require('../../../../config');

module.exports = {
    fn: gulp =>
        gulp.src(config.src.shared.path + '**/*.js')
            .pipe(babel())
            .pipe(gulp.dest(config.src.shared.output.path))
};