'use strict';

const colors = require('ansi-colors');

const styles = {
  // Default styles
  primary: colors.cyan,
  success: colors.green,
  danger: colors.magenta,
  strong: colors.bold,
  warning: colors.yellow,
  muted: colors.dim,
  disabled: colors.gray,
  dark: colors.dim.gray,
  underline: colors.underline,

  // Color modifiers
  get inverse() {
    return this._inverse || colors.inverse(this.primary);
  },
  set inverse(custom) {
    this._inverse = custom;
  },

  get complement() {
    return this._complement || colors.complement(this.primary);
  },
  set complement(custom) {
    this._complement = custom;
  },

  // Special styling
  get info() {
    return this._info || this.primary;
  },
  set info(custom) {
    this._info = custom;
  },

  get em() {
    return this._em || this.primary.underline;
  },
  set em(custom) {
    this._em = custom;
  },

  get heading() {
    return this._heading || this.muted.underline;
  },
  set heading(custom) {
    this._heading = custom;
  },

  // Statuses
  get pending() {
    return this._pending || this.primary;
  },
  set pending(custom) {
    this._pending = custom;
  },

  get submitted() {
    return this._submitted || this.success;
  },
  set submitted(custom) {
    this._submitted = custom;
  },

  get cancelled() {
    return this._cancelled || this.danger;
  },
  set cancelled(custom) {
    this._cancelled = custom;
  },

  // More special styling
  get typing() {
    return this._typing || this.dim;
  },
  set typing(custom) {
    this._typing = custom;
  },

  get placeholder() {
    return this._placeholder || this.primary.dim;
  },
  set placeholder(custom) {
    this._placeholder = custom;
  },

  get highlight() {
    return this._highlight || this.inverse;
  },
  set highlight(custom) {
    this._highlight = custom;
  }
};

// Merge function
styles.merge = (options = {}) => {
  const { styles: optionStyles } = options;
  if (optionStyles) {
    if (typeof optionStyles.enabled === 'boolean') {
      colors.enabled = optionStyles.enabled;
    }
    if (typeof optionStyles.visible === 'boolean') {
      colors.visible = optionStyles.visible;
    }
  }

  const result = { ...styles, ...optionStyles };
  delete result.merge;

  for (const key in colors) {
    if (!result.hasOwnProperty(key)) {
      Object.defineProperty(result, key, { get: () => colors[key] });
    }
  }

  for (const key in colors.styles) {
    if (!result.hasOwnProperty(key)) {
      Object.defineProperty(result, key, { get: () => colors[key] });
    }
  }
  
  return result;
};

module.exports = styles;
