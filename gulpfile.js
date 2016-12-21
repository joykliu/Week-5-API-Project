var gulp   = require('gulp'),
		browserSync = require('browser-sync'),
		babel = require('gulp-babel'),
		reload = browserSync.reload,
		autoprefixer = require('gulp-autoprefixer'),
		concat = require('gulp-concat'),
		imageMin = require('gulp-imagemin'),
		cleanCSS = require('gulp-clean-css'),
		notify = require('gulp-notify'),
		plumber = require('gulp-plumber'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		uglify = require('gulp-uglify');

gulp.task('bs', function() {
	browserSync.init({
		// if running on windows, change this to http://localhost
		server: {
            baseDir: "./public"
        }
	});
});

gulp.task('styles', function() {
	return gulp.src('./dev/styles/**/*.scss')
		.pipe(plumber({
		  errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(cleanCSS())
		.pipe(concat('style.css'))
		.pipe(autoprefixer('last 5 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/styles'))
		.pipe(reload({ stream: true }));
});

gulp.task('scripts', function () {
	return gulp.src('./dev/scripts/main.js')
		.pipe(plumber({
		  errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(sourcemaps.init())
			.pipe(babel({
				presets: ['es2015']
			}))
			.pipe(concat('main.min.js'))
			.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./public/scripts'))
		.pipe(reload({stream:true}));
});

gulp.task('images', function () {
	return gulp.src('./public/images/**/*')
		.pipe(imageMin())
		.pipe(gulp.dest('./public/images'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
	gulp.watch('./dev/styles/**/*.scss', ['styles']);
	gulp.watch('./dev/scripts/main.js', ['scripts']);
	gulp.watch('./public/*.html', reload);
});

gulp.task('default', ['styles', 'scripts', 'images', 'bs', 'watch']);
