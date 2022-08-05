'use strict';

const gulp = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sortMediaQueries = require('postcss-sort-media-queries');
const sourcemaps = require('gulp-sourcemaps');
const dependents = require('gulp-dependents');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

const dest = './src/styles/'
const files = {
	scssPath: [
		dest + 'settings/*.scss',
        dest + 'components/*.scss',
        dest + 'pages/*.scss',
		dest + '*.scss']
}

gulp.task('styles', () => {
    return gulp.src(dest + '*.scss')
        .pipe(sourcemaps.init())
        .pipe(dependents())
        .pipe(sass({ outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(postcss([autoprefixer(), sortMediaQueries({
            sort: 'mobile-first'
        })]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(dest));
});


const jsDest = './src/js/';
const filesJs = './src/js/components/*.js';

gulp.task('scripts', function() {
    return gulp.src(filesJs)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

gulp.task('watch', () => {
    gulp.watch(files.scssPath, gulp.series('styles'));
});

gulp.task('watchJs', () => {
    gulp.watch(filesJs, gulp.series('scripts'));
});