var gulp = require('gulp'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	del = require('del'),
    pump = require('pump'),
    uglifyjs = require('uglify-js'),
    composer = require('gulp-uglify/composer')
    ;

function minifyjs(cb){
    var options = {
        // : 'license'
    };
    var minify = composer(uglifyjs, console);

    pump([
        gulp.src('src/*.js'),
        concat('chen.js'),
        gulp.dest('dist/'),
        rename({suffix: '.min'}),
        minify(options),
        gulp.dest('dist/')
    ],cb);
}

function clean(cb){
    del(['Chen'], cb)
}

exports.build = clean;
exports.default = minifyjs;
