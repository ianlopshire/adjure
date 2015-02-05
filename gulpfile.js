var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    wrap = require('gulp-wrap'),
    concat = require('gulp-concat'),
    declare = require('gulp-declare'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');
    color = require('colors');

var lessWatchPath = [
		'./less/**/*.less'
	],
	lessCompilePath = [
		'./less/screen.less'
	],
	lessDestPath = './assets/css';

function lessError(err) {
	if (err.plugin == "gulp-less") {
		console.log("######################".red);
		console.log("##    LESS ERROR    ##".red);
		console.log("######################".red);
		console.log("");
		console.log(err.message);
		console.log("");
		console.log("File: ".green + err.fileName);
		console.log("Line: ".green + err.line);
		console.log("");
		console.log(err.extract.toString().blue);
		console.log("");
		console.log("");
	} else {
		console.log(err.toString());
	}
}

gulp.task('less', function () {
	gulp.src(lessCompilePath).on('error', lessError)
		.pipe(less({
			paths: [ path.join(__dirname, 'less', 'includes') ]
		})).on('error', lessError)
		.pipe(gulp.dest(lessDestPath)).on('error', lessError);
});

gulp.task('watch', function() {
	gulp.watch(lessWatchPath, ['less']);
});

gulp.task('default', ['less']);