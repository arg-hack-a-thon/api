var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var stylish = require('jshint-stylish')

gulp.task('lint', function() {
  return gulp.src(['./server/**/*.js', './test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail')); // Makes command fail if it does not pass
});