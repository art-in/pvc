const config = require('../../../config');

module.exports = {
    deps: ['clean:client'],
    fn: function(gulp) {
        return gulp.src(config.src.client.root + '/**/*.html')
            .pipe(gulp.dest(config.src.client.output.path));
    }
};