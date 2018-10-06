'use strict';

const path = require('path');
const prompt = require('helper-prompt');
const sitemap = require('assemble-sitemaps');
const pageData = require('assemble-middleware-page-variable');
const geopattern = require('helper-geopattern');
const helpers = require('handlebars-helpers');
const Store = require('data-store');

/**
 * Configuration for assemblefile.js. Includes:
 * - plugins
 * - helpers
 * - middleware
 * - data
 */

module.exports = (app, cwd) => {
  app.cwd = path.resolve(cwd, '..');

  /**
   * Listen for errors
   */

  app.on('error', console.error);

  /**
   * Build paths
   */

  const paths = {};
  paths.src = path.join.bind(path, cwd, 'src');
  paths.dest = path.join.bind(path, cwd, '../docs');
  paths.assets = path.join.bind(path, paths.dest('assets'));
  paths.data = path.join.bind(path, paths.src('data'));

  /**
   * Create a data store on `app`, for storing
   * dynamically created config variables (usually from prompts)
   */

  app.store = new Store({path: paths.data('enquirer.json')});

  /**
   * Build "options" (paths are useful in helpers)
   */

  app.option('engine', 'hbs');
  app.option('assets', paths.assets());
  app.option('dest', paths.dest());

  /**
   * `site` data (for rendering templates)
   */

  app.data('site', app.pkg.data);
  app.data('site.title', app.data('site.name'));
  app.data('site.org.url', 'https://github.com/enquirer');
  app.data('site.nav.main', ['docs', 'prompts']);
  app.data('site.nav.dropdown', ['examples', 'contributing', 'about']);
  app.data('site.google.analytics_id', '');
  app.data('site.google.tags_id', '');
  app.data('site.author.username', 'jonschlinkert');
  app.data('assets', paths.assets());
  app.data('dest', paths.dest());

  /**
   * Plugins
   */

  app.use(sitemap());

  /**
   * Middleware
   */

  app.onLoad(/\.(md|hbs)$/, pageData(app));

  /**
   * Handlebars helpers
   */

  app.helpers(helpers());
  app.helper('geopattern', geopattern({color: '#614676'}));
  app.helper('geoColor', geopattern.color({color: '#614676'}));
  app.helpers(require('./helpers'));

  /**
   * Async helpers
   */

  app.asyncHelper('prompt', prompt({store: app.store}));

  // return build paths
  return paths;
};
