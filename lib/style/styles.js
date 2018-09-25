'use strict';

const colors = require('ansi-colors');
const utils = require('../utils');

const styles = {
  default: colors.none,

  /**
   * Main palette
   */

  primary: colors.cyan,
  muted: colors.dim,
  dark: colors.dim.gray,

  danger: colors.red,
  strong: colors.bold,
  success: colors.green,
  warning: colors.yellow,
  disabled: colors.gray,
  get info() {
    return this.primary;
  },
  get inverse() {
    return utils.inverse(this.primary);
  },

  /**
   * Prompt Statuses
   */

  get pending() {
    return this.default;
  },
  get completing() {
    return this.pending;
  },
  get cancelled() {
    return this.default;
  },
  get answered() {
    return this.primary;
  },

  /**
   * Choice statuses
   */

  get on() {
    return this.success;
  },
  get off() {
    return this.dark;
  },

  get active() {
    return this.primary;
  },
  get selected() {
    return this.active.underline;
  },

  /**
   * User input styling
   */

  get mask() {
    return this.muted;
  },
  get hint() {
    return this.muted;
  },

  get placeholder() {
    return this.muted;
  },
  get highlight() {
    return this.inverse;
  }
};

styles.merge = (options = {}) => {
  return utils.merge(styles, options.styles);
};

module.exports = styles;
