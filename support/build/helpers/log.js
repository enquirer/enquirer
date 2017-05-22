'use strict';

/**
 * TODO: fix whatever is overriding the handlebars
 * built-in {{log}} helper. for now this works
 */

module.exports = function() {
  var args = [].slice.call(arguments);
  args.pop();
  console.log.apply(console, args);
};
