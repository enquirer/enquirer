'use strict';

module.exports = function() {
  var args = [].slice.call(arguments, 0, -1);
  for (var i = 0; i < args.length; i++) {
    var val = args[i];
    if (val) {
      return val;
    }
  }
};
