var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    cssBase64 = require('gulp-css-base64'),
    path = require('path'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    browserSync = require('browser-sync').create();


gulp.task('build', [
    'webpack:build'
]);


gulp.task('webpack:build', function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err)
            throw new gutil.PluginError('webpack:build', err);
        gutil.log('[webpack:build] Completed\n' + stats.toString({
            assets: true,
            chunks: false,
            chunkModules: false,
            colors: true,
            hash: false,
            timings: false,
            version: false
        }));
        browserSync.reload();
        callback();
    });
});

gulp.task('sass', function () {
  return gulp.src('./src/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
       errLogToConsole: true,
       paths: [ path.join(__dirname, 'sass', 'includes') ]
     }).on("error", sass.logError))
     .pipe(cssBase64())
     .pipe(autoprefixer())
     .pipe(sourcemaps.write('./'))
     .pipe(gulp.dest('./dist/css/'))
     .pipe(browserSync.stream({match: '**/*.css'}));
});

// Gulp Watch Task
gulp.task('watch', function () {
  gulp.watch('./src/**/*', ['build']);
  gulp.watch('../drawing/lib/**/*', ['build']);
  gulp.watch('./src/sass/**/*', ['sass']);
});

//Gulp Browsersync
gulp.task('browser-sync', function(){
  browserSync.init({
    server:{
      baseDir: "./"
    }
  });
});

// Gulp Default Task
gulp.task('default', ['browser-sync','watch']);
