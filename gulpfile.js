var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	del = require('del'),
    pump = require('pump'),
    uglifyjs = require('uglify-js'),
    minifier = require('gulp-uglify/minifier');

gulp.task('minifyjs', function(cb) {
    var options = {
        preserveComments: 'license'
    };
    pump([
        gulp.src('src/*.js'),
        concat('chen.js'),
        gulp.dest('Chen/'),
        rename({suffix: '.min'}),
        // uglify(),
        minifier(options, uglifyjs),
        gulp.dest('Chen/')
    ],cb);
});

gulp.task('clean', function(cb) {
    del(['Chen'], cb)
});

gulp.task('default', [], function() {
    gulp.start('minifyjs');
});
