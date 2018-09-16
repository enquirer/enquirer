'use strict';

var path = require('path');
var through = require('through2');
var unescape = require('unescape');

/**
 * Unescape template delimiters that were escaped when markdown was converted
 */

module.exports = options => {
  return through.obj(function(file, enc, next) {
    if (file.isNull() || file.isDirectory()) {
      next(null, file);
      return;
    }

    if (file.extname !== '.md' && path.extname(file.history[0]) !== '.md') {
      next(null, file);
      return;
    }

    try {
      let str = file.contents.toString();
      str = str.replace(/(\{{2,4})([^}]+)(\}{2,4})/g, (m, open, inner, close) => {
        return open + unescape(inner) + close;
      });
      file.contents = Buffer.from(str);
    } catch (err) {
      this.emit('error', new PluginError('unescape', err, { fileName: file.path }));
      return;
    }
    next(null, file);
  });
};
