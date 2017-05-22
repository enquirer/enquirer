'use strict';

var assemble = require('assemble');
var extname = require('gulp-extname');
var drafts = require('gulp-drafts');
var sass = require('gulp-sass');
var toc = require('gulp-html-toc');
var del = require('delete');

/**
 * Initialize assemble (pass exts for default engine)
 */

var app = module.exports = assemble();

/**
 * Local dependencies
 */

var pipeline = require('./build/pipeline');
var defaults = require('./build/defaults');
var config = require('./build/config');

/**
 * Load build config (returns build paths)
 */

var paths = config(app, __dirname);

/**
 * Clean out dest on re-buid
 */

app.task('clean', function() {
  return del(paths.dest(), {force: true});
});

/**
 * Load templates
 */

app.task('templates', function(cb) {
  app.partials(paths.src('templates/partials/*.hbs'));
  app.layouts(paths.src('templates/layouts/*.hbs'));
  app.pages(paths.src('pages/*.md'));
  cb();
});

/**
 * Root site files
 */

app.task('root', function() {
  return app.src(paths.src('root/*'), {dot: true})
    .pipe(app.renderFile('*'))
    .pipe(app.dest(paths.dest()));
});

/**
 * Copy assets
 */

app.task('assets', function() {
  return app.copy(paths.src('assets/**/*'), paths.dest('assets'), {dot: true});
});

/**
 * Convert sass and write .css files
 */

app.task('css', function() {
  return app.src('src/sass/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(app.dest(paths.assets('css')));
});

/**
 * Render templates and write .html files
 */

app.task('html', ['templates'], function() {
  app.data('sitemap', app.store.get('site'));
  app.data('site', app.store.get('site'));

  return app.toStream('pages')
    .pipe(extname())
    .pipe(drafts())
    .pipe(pipeline.markdown(defaults))
    .pipe(app.sitemap())
    .pipe(app.renderFile())
    .pipe(pipeline.cheerio())
    .pipe(toc({id: 'navigation', selectors: 'h2,h3'}))
    .pipe(app.dest(paths.dest()));
});

/**
 * Build
 */

app.task('default', ['clean', 'css', 'html', 'root', 'assets']);
