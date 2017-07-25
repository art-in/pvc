const seq = require('gulp-sequence');

module.exports = {
    fn: function(gulp, cb) {
        // moved server build to separate task without 'clean' reference,
        // so it can be used from 'watch:server'.
        // changing server files should not initiate clean each time,
        // otherwise nodemon will fail to watch folder
        seq('clean:server', 'build:server:no-clean', cb);
    }
};