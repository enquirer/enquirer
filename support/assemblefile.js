'use strict';

var del = require('delete');
var assemble = require('assemble');

/**
 * Initialize assemble (pass exts for default engine)
 */

var app = module.exports = assemble({
  exts: ['md', 'hbs', 'html', 'xml', 'txt']
});

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
console.log(app.cache.data.site)

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
 * Render templates and write files
 */

app.task('html', ['templates'], function() {
  return app.toStream('pages')
    .pipe(pipeline.markdown(defaults))
    .pipe(app.renderFile())
    .pipe(app.dest(paths.dest()));
});

/**
 * Build
 */

app.task('default', ['clean', 'html', 'root', 'assets']);
