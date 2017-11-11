const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

gulp.task('sass', () => {
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('html', () => {
  return gulp.src('app/**/*.html')
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', () => {
  return gulp.src('app/js/**/*.js')
    .pipe(browserSync.reload({
      stream: true
    }));
})

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    notify: false,
  });
});

gulp.task('watch', ['browser-sync', 'sass'], () => {
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/**/*.html', ['html']);
  gulp.watch('app/js/**/*.js', ['js']);
});

gulp.task('default', ['watch']);
