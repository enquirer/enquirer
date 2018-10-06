'use strict';

/**
 * Helper for sorting pages before rendering
 */

module.exports = (items, order, options) => {
  if (!Array.isArray(order)) {
    return items;
  }

  let unique = new Set();
  for (let ele of order) {
    let name = ele.toLowerCase();
    let item = items.find(item => item.stem.toLowerCase() === name);
    if (item) {
      unique.add(item);
    }
  }
  return [...unique];
};
