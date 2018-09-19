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
   * Set paths. We also add paths to options, since it's  useful in helpers,
   * and to data, to ensure paths are exposed on the context.
   */

  const paths = {};
  const setPath = (name, filepath) => {
    paths[name] = filepath;
    if (typeof filepath === 'function') filepath = filepath();
    app.option(name, filepath);
    app.data(name, filepath);
  };

  paths.src = path.join.bind(path, cwd, 'src');
  paths.dest = path.join.bind(path, cwd, '../docs');
  paths.data = path.join.bind(path, paths.src('data'));
  paths.assets = path.join.bind(path, paths.dest('assets'));

  /**
   * Create a data store on `app`, for storing
   * dynamically created config variables (usually from prompts)
   */

  app.store = new Store({ path: paths.data('enquirer.json') });

  /**
   * Set "options" (paths defined on options can be useful in helpers)
   */

  app.option('engine', 'hbs');

  /**
   * `site` data (for rendering templates)
   */

  app.data('project', app.pkg.data);
  app.data('project.title', app.data('project.name'));
  app.data('project.org.url', 'https://github.com/enquirer');
  app.data('project.nav.main', ['docs', 'prompts']);
  app.data('project.nav.dropdown', ['examples', 'contributing', 'about']);
  app.data('project.google.analytics_id', '');
  app.data('project.google.tags_id', '');
  app.data('project.author.username', 'jonschlinkert');

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

  app.asyncHelper('prompt', prompt({ store: app.store }));

  // return build paths
  return paths;
};
