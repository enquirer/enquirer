'use strict';

const colors = require('ansi-colors');
const utils = require('./utils');

const styles = {
  default: colors.none,
  noop: colors.none,

  /**
   * Modifiers
   */

  complementary: utils.complement,
  opposite: utils.inverse,
  get inverse() {
    return this.opposite(this.primary);
  },
  get complement() {
    return this.complementary(this.primary);
  },

  /**
   * Main color
   */

  primary: colors.cyan,

  /**
   * Main palette
   */

  success: colors.green,
  danger: colors.red,
  strong: colors.bold,
  warning: colors.yellow,
  muted: colors.dim,
  disabled: colors.gray,
  dark: colors.dim.gray,
  get info() {
    return this.primary;
  },
  get em() {
    return this.primary.underline;
  },

  /**
   * Statuses
   */

  get pending() {
    return this.primary;
  },
  get submitted() {
    return this.success;
  },
  get cancelled() {
    return this.danger;
  },

  /**
   * Special styling
   */

  get placeholder() {
    return this.primary.dim;
  },
  get highlight() {
    return this.inverse;
  }
};

styles.merge = (options = {}) => {
  let result = utils.merge({}, styles, options.styles);
  delete result.merge;
  return result;
};

module.exports = styles;
