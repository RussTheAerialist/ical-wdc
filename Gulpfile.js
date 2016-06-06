var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var template = require('gulp-template');

gulp.task('default', ['browserify', 'template']);

gulp.task('browserify', () => {
  return browserify('./index.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('template', () => {
  return gulp.src('templates/index.html')
    .pipe(template())
    .pipe(gulp.dest('./build/'));
});