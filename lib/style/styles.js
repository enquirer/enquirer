'use strict';

const colors = require('ansi-colors');
colors.clear = str => str;

const defaults = {
  active: colors.cyan,
  answered: colors.cyan,
  danger: colors.red,
  default: colors.clear,
  disabled: colors.gray,
  hint: colors.dim,
  info: colors.blue,
  muted: colors.dim.gray,
  off: colors.dim.gray,
  on: colors.green,
  selected: colors.cyan.underline,
  strong: colors.bold,
  success: colors.green,
  warning: colors.yellow,
  typed: str => str
};

module.exports = styles => ({ ...defaults, ...styles });
