'use strict';

const utils = require('./utils');
const colors = require('ansi-colors');
const styles = {
  default: colors.noop,
  noop: colors.noop,

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
  danger: colors.magenta,
  strong: colors.bold,
  warning: colors.yellow,
  muted: colors.dim,
  disabled: colors.gray,
  dark: colors.dim.gray,
  get info() {
    return this.primary;
  },
  get heading() {
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
  if (options.styles && typeof options.styles.enabled === 'boolean') {
    colors.enabled = options.styles.enabled;
  }
  if (options.styles && typeof options.styles.visible === 'boolean') {
    colors.visible = options.styles.visible;
  }

  let result = utils.merge({}, styles, options.styles);
  delete result.merge;

  for (let key of Object.keys(colors.styles)) {
    if (!result.hasOwnProperty(key)) {
      Reflect.defineProperty(result, key, {
        get() {
          return colors[key];
        }
      });
    }
  }

  return result;
};

module.exports = styles;
