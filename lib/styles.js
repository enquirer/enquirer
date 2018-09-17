'use strict';

const colors = require('ansi-colors');
const defaults = {
  answered: colors.cyan,
  active: colors.cyan,
  hint: colors.dim
};

module.exports = styles => ({ ...defaults, ...styles });
