'use strict';

const url = require('url');

/**
 * Get the domain name from `site.homepage`
 */

module.exports = function() {
  let homepage = this.app.data('site.homepage') || this.app.data('site.bugs.url');
  if (homepage) {
    let obj = url.parse(homepage);
    return obj.host || obj.hostname;
  }
  return '';
};
