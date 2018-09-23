'use strict';

const colors = require('ansi-colors');
const utils = require('../utils');

const defaults = {
  default: colors.none,

  primary: colors.cyan,
  dark: colors.dim.gray,
  muted: colors.dim,

  danger: colors.red,
  info: colors.cyan,
  strong: colors.bold,
  success: colors.green,
  warning: colors.yellow,
  disabled: colors.gray,

  get pending() {
    return this.default;
  },
  get completing() {
    return this.default;
  },
  get cancelled() {
    return this.default;
  },

  get on() {
    return this.success;
  },
  get off() {
    return this.dark;
  },

  get mask() {
    return this.muted;
  },
  get hint() {
    return this.muted;
  },

  get active() {
    return this.primary;
  },
  get answered() {
    return this.primary;
  },
  get selected() {
    return this.primary.underline;
  },

  get placeholder() {
    return this.primary.dim.bold;
  },
  get highlight() {
    return utils.inverse(this.primary);
  }
};

module.exports = (options = {}) => {
  if (!options.styles) return defaults;
  for (let key of Object.keys(options.styles)) {
    let desc = Object.getOwnPropertyDescriptor(options.styles, key);
    Object.defineProperty(defaults, key, desc);
  }
  return defaults;
};
