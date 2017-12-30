
const SRC   = './src';
const DIST  = './dist';
const TASKS = './tasks';

const gulp    = require('gulp');
const run     = require('run-sequence');
const glob    = require("glob");

const ARGS = require('yargs').default('production', false).argv;

glob.sync(`${TASKS}/*.js`, {}).forEach( (file) => {
    require(file)(ARGS, SRC, DIST);
});

gulp.task('default', (callback) => run('scripts', callback));
gulp.task('watch', (callback) => run('watchScripts', callback));
