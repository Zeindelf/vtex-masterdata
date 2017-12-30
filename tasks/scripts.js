
const gulp       = require('gulp');
const gulpIf     = require('gulp-if');
const browserify = require('browserify');
const babelify   = require('babelify');
const uglify     = require('gulp-uglify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const notify     = require("gulp-notify");
const plumber    = require('gulp-plumber');
const rename     = require('gulp-rename');

module.exports = function(ARGS, SRC, DIST) {
    /**
     * Concatena e minifica arquivos JS
     */
    gulp.task('scripts', () => {
        return browserify(`${SRC}/index.js`)
            .transform(babelify).bundle()
            .pipe(source('index.js'))
            .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
            .pipe(rename('vtex-minicart.js'))
            .pipe(gulpIf(ARGS.production, buffer()))
            .pipe(gulpIf(ARGS.production, uglify()))
            .pipe(gulpIf(ARGS.production, rename('vtex-minicart.min.js')))
            .pipe(notify({
                title: "Scripts Merged!",
                message: "Generate file: <%= file.relative %>!"
            }))
            .pipe(gulp.dest(`${DIST}`));
    });

    /**
     * Scripts Watch
     */
    gulp.task('watchScripts', () => {
        return gulp.watch(`${SRC}/*.js`, ['scripts'])
            .on('change', (ev) => {
                console.log(`File ${ev.path} was ${ev.type}, running tasks...`);
            });
    });
};
