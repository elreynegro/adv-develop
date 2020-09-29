const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const del = require('del');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
	dev: 'css',
	dest: ''
};

gulp.task('clean', () => del([`${paths.dest}/main.css`]));

gulp.task('build', ['clean'], () => {

		// THIS CODE MINIFIES THE CSS
		gulp.src(`${paths.dev}/main.scss`)
	        .pipe(sass())
	        .pipe(autoprefixer())
	        .pipe(cleanCss())
	        .pipe(rename('style.css'))
	        .pipe(gulp.dest(`${paths.dest}`));

    	// THIS CODE CREATES REGULAR THE CSS
    	// gulp.src(`${paths.dev}/main.scss`)
    	// 	.pipe(sourcemaps.init())
		   //      .pipe(sass())
		   //      .pipe(autoprefixer())
		   //      .pipe(rename('style.css'))
	    //     .pipe(sourcemaps.write(`./${paths.dev}`))
	    //     .pipe(gulp.dest(`${paths.dest}`));

});

gulp.task('watch', ['build'], () => {
	gulp.watch(`${paths.dev}/**/*.scss`, ['build']);
});

gulp.task('default', ['watch']);