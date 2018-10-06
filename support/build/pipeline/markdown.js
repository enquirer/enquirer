'use strict';

const path = require('path');
const PluginError = require('plugin-error');
const Remarkable = require('remarkable');
const through = require('through2');

/**
 * convert markdown to HTML
 */

module.exports = options => {
  const opts = { ...options };

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
      let md = new Remarkable(opts);
      file.contents = Buffer.from(md.render(file.contents.toString()));
      file.extname = '.html';
    } catch (err) {
      this.emit('error', new PluginError('remarkable', err, { fileName: file.path }));
      return;
    }
    next(null, file);
  });
};
