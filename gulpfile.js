var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');


/**********
 *  HTML  *
 **********/
gulp.task('html', () => {
    gulp.src('./src/*.html').pipe(gulp.dest('./dist/'));
});
gulp.task('html-watch', () => {
    gulp.watch('./src/*.html', ['html']);
});


/*****************
 *  SASS / SCSS  *
 *****************/
var sass = require('gulp-sass');

gulp.task('sass', () => {
    gulp.src('./src/**/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass().on('error', sass.logError))
            .pipe(concat('app.css'))
        .pipe(sourcemaps.write())

        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('sass-watch', () => {
    gulp.watch('./src/**/*.scss', ['sass']);
});



/*************
 *  WEBPACK  *
 *************/
var webpackConf = require('./webpack.config.js');
var webpack = require('webpack');

gulp.task('webpack', (callback) => {
    webpack(webpackConf, (err, stats) => {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('webpack-watch', () => {
    var wp = webpack(webpackConf);

    wp.watch({}, (err, stats) => {
        if(err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({}));
    });
});



/************
 *  SERVER  *
 ************/
var webserver = require('gulp-webserver');

gulp.task('webserver', () => {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            fallback: 'index.html'
        }));
});


gulp.task('build', ['html', 'sass', 'webpack']);
gulp.task('watch', ['html-watch', 'sass-watch', 'webpack-watch', 'webserver']);
gulp.task('default', ['watch']);
