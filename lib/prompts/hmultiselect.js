'use strict';

const hSelect = require('./hselect');

class hMultiSelect extends hSelect {
  constructor(options) {
    super({ ...options, multiple: true });
  }
}

module.exports = hMultiSelect;
