/*
 * Gulp Build File for Adjure
 *
 * This file contains all of the build tasks for the adjure program
 * To see a more readable list of tasks, run `gulp help`
 * 
 */

var del      = require('del'),
    zip      = require('gulp-zip'),
    path     = require('path'),
    chalk    = require('chalk'),
    less     = require('gulp-less'),
    concat   = require('gulp-concat'),
    uglify   = require('gulp-uglify'),
    sequence = require('run-sequence'),

    gulp     = require('gulp-help')(require('gulp'), {
        hideEmpty: true,
        hideDepsMessage: true
    }),

    paths    = {
        js: ['./bower_components/jquery/dist/jquery.js', './bower_components/handlebars/handlebars.js', './src/js/**/*.js'],
        css: ['./src/less/adjure.less']
    };

/*
 * Error Handling Function
 */
function error(err) {
    var file = err.fileName || err.file || 'Not specified',
        line = err.lineNumber || err.line || 'Not specified',
        message = err.message || 'Not specified';

    console.log(chalk.red('An error occured in the ' + err.plugin + ' plugin.'));
    console.log(chalk.red('with the message: ') + message);
    console.log(chalk.green('File: ') + file);
    console.log(chalk.green('Line: ') + line);
    console.log('');
    console.log(chalk.green('Raw Error: ') + err.toString());

    this.emit('end');
}

/*
 * Build Tasks
 */

// Development Build Task - compiles all files into developer-ready format
gulp.task('dev', 'Compiles all code in uncompressed format', function (cb) {
    sequence('clean:assets', ['js', 'css'], cb);
});

// Production Build Task - compiles all files into production-ready format
gulp.task('prod', 'Compiles all code in compressed format', function (cb) {
    sequence('clean:assets', ['js:min', 'css'], cb);
});

// Regular JS build task - compiles and minifies all vendor and adjure js into /assets/adjure.js
gulp.task('js', function () {
    var bower = './bower_components/';
    return gulp.src(paths.js)
        .pipe(concat('adjure.js'))
        .pipe(gulp.dest('./assets/'));
});

// Min JS build task - compiles and minifies all vendor and adjure js into /assets/adjure.js
gulp.task('js:min', function () {
    return gulp.src(paths.js)
        .pipe(concat('adjure.js'))
        .pipe(uglify({mangle: true}))
        .pipe(gulp.dest('./assets/'));
})

// CSS Build task - compiles the less src files into /assets/adjure.css
gulp.task('css', function () {
    return gulp.src(paths.css)
        .pipe(less()).on('error', error)
        .pipe(gulp.dest('./assets/'));
});

// Watch Task - watches for changes in src files and rebuilds them on file change
gulp.task('watch', 'Builds files in dev mode and then watches for changes', ['dev'], function () {
    gulp.watch('./src/less/**/*.less', ['css']);
    gulp.watch('./src/js/**/*.js', ['js'])
});

// Release task - compresses all necessary files into dist/adjure.zip
gulp.task('release', 'Creates a release zip', ['prod'], function () {
    return gulp.src(['./assets/*', './adjure.html'], {base: './'})
        .pipe(zip('adjure.zip'))
        .pipe(gulp.dest('./dist/'));
});

/*
 * Cleanup/Removal Tasks
 */

// Clean Task - removes all installed dependencies
gulp.task('clean', 'Removes all dependencies', function (cb) {
    del(['./bower_components', './node_modules'], cb);
});

// Assets Clean Task - removes all compiled assets
gulp.task('clean:assets', function (cb) {
    del('./assets/**/*', cb);
});
