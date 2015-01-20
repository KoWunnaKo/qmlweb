var gulp    = require('gulp');
var order   = require('gulp-order');
var uglify  = require('gulp-uglify');
var concat  = require('gulp-concat');
var rename  = require('gulp-rename');
var changed = require('gulp-changed');
var jasmine = require('gulp-jasmine-phantom');

var qtcoreSources = [
  'src/helpers/encapsulate.begin.js',
  'src/qtcore/qml/QMLBinding.js',

  'src/uglify/ast.js',
  'src/uglify/parse.js',
  'src/uglify/utils.js',

  'src/qtcore/qml/lib/parser.js',
  'src/qtcore/qml/lib/process.js',
  'src/qtcore/qml/lib/import.js',

  'src/qtcore/qrc.js',
  'src/qtcore/qt.js',
  'src/qtcore/signal.js',
  'src/qtcore/font.js',
  'src/qtcore/easing.js',
  'src/qtcore/qml/qml.js',
  'src/qtcore/qml/**/*.js',

  'src/qmlweb/**/*.js',
  'src/helpers/encapsulate.end.js'
];

var tests = [
  'tests/**/*.js'
];

gulp.task('qt', function() {
  return gulp.src(qtcoreSources)
             .pipe(order(qtcoreSources, { base: __dirname }))
             .pipe(concat('qt.js'))
             .pipe(changed('./lib'))
             .pipe(gulp.dest('./lib'));
});

gulp.task('min-qt', ['qt'], function() {
  return gulp.src('./lib/qt.js')
             .pipe(rename('qt.min.js'))
             .pipe(changed('./lib'))
             .pipe(uglify())
             .pipe(gulp.dest('./lib'));
});

gulp.task('build', ['qt', 'min-qt']);

gulp.task('test', ['build'], function() {
  return gulp.src(tests)
             .pipe(jasmine({
               integration: true,
               vendor: ['./lib/qt.js']
             }));
});

gulp.task('watch', ['build'], function() {
  gulp.watch(qtcoreSources, ['build']);
});

gulp.task('watch-tests', ['build', 'test'],function() {
  gulp.watch(qtcoreSources, ['build', 'test']);
  gulp.watch(tests, ['test']);
});

gulp.task('default', ['watch']);