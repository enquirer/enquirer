'use strict';

const assemble = require('assemble');
const reflinks = require('gulp-reflinks');
const extname = require('gulp-extname');
const drafts = require('gulp-drafts');
const sass = require('gulp-sass');
const toc = require('gulp-html-toc');
const del = require('delete');

/**
 * Initialize assemble (pass file extensions to use for default engine)
 */

const app = module.exports = assemble();

/**
 * Local dependencies
 */

const pipeline = require('./build/pipeline');
const defaults = require('./build/defaults');
const config = require('./build/config');

/**
 * Load build config (returns build paths)
 */

const paths = config(app, __dirname);

/**
 * Clean out dest on re-buid
 */

app.task('clean', () => {
  return del(paths.dest(), { force: true });
});

/**
 * Load templates
 */

app.task('templates', cb => {
  app.partials(paths.src('templates/partials/*.hbs'));
  app.layouts(paths.src('templates/layouts/*.hbs'));
  app.pages(paths.src('content/*.md'));
  cb();
});

/**
 * Root site files
 */

app.task('root', () => {
  return app
    .src(paths.src('root/*'), { dot: true })
    .pipe(app.renderFile('*'))
    .pipe(app.dest(paths.dest()));
});

/**
 * Copy assets
 */

app.task('assets', () => {
  return app.copy(paths.src('assets/**/*'), paths.dest('assets'), { dot: true });
});

/**
 * Convert sass and write .css files
 */

app.task('css', () => {
  return app.src('src/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(app.dest(paths.assets('css')));
});

/**
 * Render templates and write .html files
 */

app.task('html', ['templates'], () => {
  app.data('sitemap', app.store.get('site'));
  app.data('site', app.store.get('site'));

  return app.toStream('pages')
    .pipe(extname())
    .pipe(drafts())
    .pipe(reflinks())
    .pipe(pipeline.markdown(defaults))
    .pipe(pipeline.unescape())
    .pipe(app.sitemap())
    .pipe(app.renderFile())
    .pipe(pipeline.cheerio())
    .pipe(toc({ id: 'navigation', selectors: 'h2,h3', parentLink: false }))
    .pipe(app.dest(paths.dest()));
});

/**
 * Build
 */

app.task('default', ['clean', 'css', 'html', 'root', 'assets']);
