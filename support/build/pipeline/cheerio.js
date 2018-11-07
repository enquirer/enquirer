'use strict';

const through = require('through2');
const cheerio = require('cheerio');

module.exports = options => {
  const whitelist = new Set(['.html', '.xml', '.xml', '.xhtml']);
  const some = (exts = []) => exts.some(ext => whitelist.has(ext));

  return through.obj((file, enc, next) => {
    if (file.isNull() || file.isDirectory()) {
      next(null, file);
      return;
    }

    if (!some(file.extname, file.history[0])) {
      next(null, file);
      return;
    }

    file.$ = cheerio.load(file.contents.toString(), options);
    next(null, file);
  });
};

