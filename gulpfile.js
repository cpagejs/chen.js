var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	del = require('del');

gulp.task('minifyjs', function() {
    return gulp.src('src/*.js')
        .pipe(concat('chen.js'))    
        .pipe(gulp.dest('Chen/'))  
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())  
        .pipe(gulp.dest('Chen/')); 
});

gulp.task('clean', function(cb) {
    del(['Chen'], cb)
});

gulp.task('default', [], function() {
    gulp.start('minifyjs');
});
