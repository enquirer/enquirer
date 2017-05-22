'use strict';

var path = require('path');
var geopattern = require('helper-geopattern');
var pageData = require('assemble-middleware-page-variable');
var helpers = require('handlebars-helpers');

/**
 * Configuration for assemblefile.js. Includes:
 * - plugins
 * - helpers
 * - middleware
 * - data
 */

module.exports = function(app, cwd) {
  app.cwd = path.resolve(cwd, '..');

  /**
   * Listen for errors
   */

  app.on('error', function(err) {
    console.log(err);
  });


  /**
   * Build paths
   */

  var paths = {};
  paths.src = path.join.bind(path, cwd, 'src');
  paths.dest = path.join.bind(path, cwd, '../docs');
  paths.assets = path.join.bind(path, paths.dest('assets'));

  /**
   * Build "options" (paths are useful in helpers)
   */

  app.option('engine', 'hbs');
  app.option('assets', paths.assets());
  app.option('dest', paths.dest());

  /**
   * `site` data (for rendering templates)
   */

  app.data('site', app.pkg.expand());
  app.data('site.nav.main', ['docs', 'examples']);
  app.data('site.nav.dropdown', ['examples', 'recipes', 'contributing', 'about']);
  app.data('site.google.analytics_id', '');
  app.data('site.google.tags_id', '');

  /**
   * Middleware
   */

  app.onLoad(/\.(md|hbs)$/, pageData(app));

  /**
   * Handlebars helpers
   */

  app.helpers(helpers());
  app.helper('geopattern', geopattern(app.options));
  app.helper('geoColor', geopattern.color(app.options));
  app.helpers(require('./helpers'));

  // return build paths
  return paths;
};
