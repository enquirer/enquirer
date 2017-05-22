'use strict';

var path = require('path');
var extend = require('extend-shallow');
var PluginError = require('plugin-error');
var Remarkable = require('remarkable');
var unescape = require('unescape');
var through = require('through2');

/**
 * convert markdown to HTML
 */

module.exports = function(options) {
  var opts = extend({}, options);
  return through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next(null, file);
      return;
    }

    if (path.extname(file.history[0]) !== '.md') {
      next(null, file);
      return;
    }

    try {
      var md = new Remarkable(opts);
      var str = md.render(file.contents.toString());
      str = str.replace(/(\{{2,4})([^}]+)(\}{2,4})/g, function(m, open, inner, close) {
        return open + unescape(inner) + close;
      });
      file.contents = new Buffer(str);
      file.extname = '.html';
    } catch (err) {
      this.emit('error', new PluginError('remarkable', err, {fileName: file.path}));
      return;
    }
    next(null, file);
  });
};
