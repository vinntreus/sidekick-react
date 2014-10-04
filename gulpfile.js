var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');

var baseDir = 'ui';
var buildDir = './dist/';

 
var paths = {
  css: [baseDir + '/css/**/*.css'],
  app_js: ['./' + baseDir + '/js/app.js'],
  js: [baseDir + '/js/*.jsx'],
};

gulp.task('develop', ['default', 'serve']);


gulp.task('build',['css', 'js'], function(){
  gulp.src(buildDir + 'main.css')
  .pipe(minifyCss({keepBreaks:true, processImport:false}))
  .pipe(rename('main.min.css'))
  .pipe(gulp.dest(buildDir));

  gulp.src(buildDir + '*.js')
  .pipe(rename('main.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(buildDir));
});

//run app using nodemon
gulp.task('serve', function(){
  return nodemon({
    script: 'index.js', //options: '-i ui/*'
    ignore: ['ui/*', 'dist/*']
  });
});

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['watch', 'css', 'js']);


gulp.task('watch', function() {
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('js', ['clean-js'], function() {
  return browserify(paths.app_js)
    .transform(reactify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(buildDir));
});

gulp.task('css',['clean-css'], function() {
  return gulp.src(paths.css)
    .pipe(concat('main.css'))
    .pipe(gulp.dest(buildDir));
});


gulp.task('clean-css', function(done) {
  del(['dist/*.css'], done);
});

gulp.task('clean-js', function(done) {
  del(['dist/*.js'], done);
});
