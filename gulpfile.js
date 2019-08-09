const gulp = require('gulp');
const task = {
    bundle: require('./build/webpack-task').buildAll,
    es6: require('./build/es6-task').buildES6,
    less: require('./build/less-task')
};
const paths = require('./paths');

// === LESS ===
// all components
gulp.task('less-lib', function () {
    return task.less(paths.bundle.less).pipe(gulp.dest(paths.bundle.target));
});
gulp.task('less-lib-es6', function () {
    return gulp.src(paths.es6.less).pipe(gulp.dest(paths.es6.target));
});
// local dev assets
gulp.task('less-local', function () {
    return task.less(paths.test.less).pipe(gulp.dest(paths.test.target));
});

// === TS ===
// all components
gulp.task('ts-lib', function () {
    return task.bundle({
        src: paths.bundle.ts,
        context: paths.bundle.context
    }).pipe(gulp.dest(paths.bundle.target));
});
gulp.task('ts-lib-es6', function () {
    return task.es6({
        src: paths.es6.ts,
        context: paths.es6.context
    }).pipe(gulp.dest(paths.es6.target));
});
// local dev assets
gulp.task('ts-local', function () {
	return task.bundle({
		src: paths.test.ts,
        context: paths.bundle.context
	}).pipe(gulp.dest(paths.test.target));
});

// === WATCH TASKS ===
gulp.task('watch', function () {
    gulp.watch(paths.watch.ts, {}, gulp.series((cb) => {
        console.log('TS Changed ...');
        cb();
    }, 'ts-lib'));
    gulp.watch(paths.watch.less, {}, gulp.series((cb) => {
        console.log('LESS Changed ...');
        cb();
    }, 'less-lib'));
    if (paths.watch.local) {
        gulp.watch(paths.watch.local.ts, {}, gulp.series((cb) => {
            console.log('Local TS Changed ...');
            cb();
        }, 'ts-local'));
        gulp.watch(paths.watch.local.less, {}, gulp.series((cb) => {
            console.log('Local LESS Changed ...');
            cb();
        }, 'less-local'));
    }
});

// === BUILD TASKS ===
gulp.task('build', gulp.parallel('less-lib', 'ts-lib'));
gulp.task('build-es6', gulp.parallel('less-lib-es6', 'ts-lib-es6'));
// Main assets + local assets
gulp.task('build-local', gulp.series('build', gulp.parallel('less-local', 'ts-local')));

// default -> build
gulp.task('default', gulp.series('build'));