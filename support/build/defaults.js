'use strict';

/**
 * Default options for highlight.js markdown plugin
 */

module.exports = {
  html: true,
  highlight(code, lang) {
    let hljs = require('highlight.js');
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, code).value;
      } catch (err) {}
    }

    try {
      return hljs.highlightAuto(code).value;
    } catch (err) {}
    return code;
  }
};
