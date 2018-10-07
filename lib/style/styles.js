'use strict';

const colors = require('ansi-colors');
const utils = require('../utils');

const styles = {
  default: colors.none,
  opposite: utils.inverse,
  complementary: utils.complement,

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
    return this.opposite(this.primary);
  },
  get complement() {
    return this.complementary(this.primary);
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

  get placeholder() {
    return this.primary.dim;
  },
  get highlight() {
    return this.inverse;
  }
};

styles.merge = prompt => utils.merge({}, styles, prompt.options.styles);
module.exports = styles;
