'use strict';

var camelcase = require('camel-case');

/**
 * Helper for sorting pages before rendering
 */

module.exports = function(items, order, options) {
  if (!Array.isArray(order)) {
    return items;
  }
  var len = order.length;
  var arr = new Array(len);
  for (var i = 0; i < len; i++) {
    var item = filterItem(items, order[i]);
    if (item) {
      arr.push(item);
    }
  }
  return arr;
};

function filterItem(items, name) {
  var len = items.length;
  for (var i = 0; i < len; i++) {
    var item = items[i];
    if (camelcase(item.stem) === camelcase(name)) {
      return item;
    }
  }
}
