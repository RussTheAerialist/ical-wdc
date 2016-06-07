var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var template = require('gulp-template');
var inject = require('gulp-inject');
var debug = require('gulp-debug');

gulp.task('default', ['browserify', 'template', 'proxy']);

gulp.task('browserify', () => {
  return browserify('./index.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('template', ['browserify'], () => {
  var target = gulp.src('templates/index.html')
    .pipe(template()).pipe(debug({title: 'target'}));
  var sources = gulp.src(['./build/bundle.js']).pipe(debug({title: 'sources'}));
  return target.pipe(debug({title: 'before'})).pipe(inject(sources, {
    starttag: '<!-- inject:{{ext}} -->',
    transform: (filePath, file) => { return file.contents.toString('utf8'); }
  })).pipe(debug()).pipe(gulp.dest('./build/'));
});

gulp.task('proxy', () => {
  return gulp.src('proxy.js')
    .pipe(gulp.dest('./build/'));
});
