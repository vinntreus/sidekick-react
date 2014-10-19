var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

//var nodemon = require.resolve('gulp-nodemon') ? require('gulp-nodemon') : null;
//var livereload = require.resolve('gulp-livereload') ? require('gulp-livereload') : null;
//var watchify = require.resolve('watchify') ? require('watchify') : null;

var baseDir = 'ui';
var buildDir = './dist/';

 
var paths = {
  css: [baseDir + '/css/**/*.css'],
  app_js: ['./' + baseDir + '/js/app.js'],
  js: [baseDir + '/js/*.jsx'],
};

gulp.task('develop', ['css-watch', 'css', 'js-watch', 'serve', 'livereload']);


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

// livereload browser on client app changes
gulp.task('livereload', function(){
  livereload.listen();
  gulp.watch('dist/**').on('change', livereload.changed);
});

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['watch', 'css', 'js']);


gulp.task('css-watch', function() {
  gulp.watch(paths.css, ['css']);
});

gulp.task('js',['clean-js'], function() {
  return scripts(false);
});
 
gulp.task('js-watch', function() {
  return scripts(true);
});

// gulp.task('js',['clean-js'], function() {
//   return browserify(paths.app_js)
//     .transform(reactify)
//     .bundle()
//     .pipe(source('main.js'))
//     .pipe(gulp.dest(buildDir));
// });
var production = process.env.NODE_ENV === 'production';

function scripts(watch) {
  var bundler, rebundle;
  bundler = browserify(paths.app_js, {
    basedir: __dirname, 
    debug: !production, 
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if(watch) {
    bundler = watchify(bundler);
  }
 
  bundler.transform(reactify);
 
  rebundle = function() {
    var stream = bundler.bundle();
    //stream.on('error', handleError('Browserify'));
    stream = stream.pipe(source('main.js'));
    return stream.pipe(gulp.dest(buildDir));
  };
 
  bundler.on('update', rebundle);
  return rebundle();
}

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
