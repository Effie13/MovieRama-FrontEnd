'use strict';

const gulp = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sortMediaQueries = require('postcss-sort-media-queries');
const sourcemaps = require('gulp-sourcemaps');
const dependents = require('gulp-dependents');
const cleanCSS = require('gulp-clean-css');

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
        //.pipe(sourcemaps.init())
        .pipe(dependents())
        .pipe(sass({ outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(postcss([autoprefixer(), sortMediaQueries({
            sort: 'mobile-first'
        })]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(dest));
});

gulp.task('watch', () => {
    gulp.watch(files.scssPath, gulp.series('styles'));
});