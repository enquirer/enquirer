'use strict';

var url = require('url');

/**
 * Get the domain name from `site.homepage`
 */

module.exports = function() {
  var homepage = this.app.data('site.homepage') || this.app.data('site.bugs.url');
  if (homepage) {
    var obj = url.parse(homepage);
    return obj.host || obj.hostname;
  }
  return '';
};
