import cp from "child_process";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";

import dartSass from 'sass';
import sassImport from "gulp-sass";
const sass = sassImport( dartSass );

import csso from "gulp-csso";
import imagemin from "gulp-imagemin";
import concat from "gulp-concat";
import uglify from "gulp-uglify";

import gulp from 'gulp';



	const jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.exe' : `jekyll`;

	/*
  * Build the Jekyll Site
  * runs a child process in node that runs the jekyll commands
  */
	gulp.task('jekyll-build', function (done) {
		return cp.spawn(jekyllCommand, ['build'], {stdio: 'inherit'})
		.on('close', done);
	}
	);

	/*
  * Rebuild Jekyll & reload browserSync
  */
	gulp.task('jekyll-rebuild', gulp.series(['jekyll-build'], function (done) {
		browserSync.reload();
		done();
	}));

	/*
  * Build the jekyll site and launch browser-sync
  */
	gulp.task('browser-sync', gulp.series(['jekyll-build'], function(done) {
		browserSync({
			server: {
				baseDir: '_site'
			}
		});
		done()
	}));

	/*
 * Compile and minify sass
 */
	gulp.task('sass', function() {
		return gulp.src('src/styles/**/*.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(csso())
		.pipe(gulp.dest('assets/css/'))
	});



	/*
  * Minify images
  */
	gulp.task('imagemin', function() {
		return gulp.src('src/img/**/*.{jpg,png,gif}')
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('assets/img/'))
	});

	/**
		* Compile and minify js
		*/
	gulp.task('js', function() {
		return gulp.src('src/js/**/*.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js/'))
	});

	gulp.task('watch', function() {
		gulp.watch('src/styles/**/*.scss', gulp.series(['sass', 'jekyll-rebuild']));
		gulp.watch('src/js/**/*.js', gulp.series(['js', 'jekyll-rebuild']));


		gulp.watch('src/img/**/*.{jpg,png,gif}', gulp.series(['imagemin']));

		gulp.watch(['*html', '_includes/*html', '_layouts/*.html'], gulp.series(['jekyll-rebuild']));
	});

	gulp.task('default', gulp.series(['js', 'sass', 'browser-sync', 'watch']));





