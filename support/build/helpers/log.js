'use strict';

/**
 * TODO: fix whatever is overriding the handlebars
 * built-in {{log}} helper. for now this works
 */

module.exports = (...args) => {
  args.pop(); // remove "options" from args
  console.log(...args);
};
