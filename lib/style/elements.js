'use strict';

const utils = require('../utils');

module.exports = prompt => {
  let { styles, symbols, options } = prompt;
  let elements = {};

  /**
   * Prompt message
   */

  elements.message = state => styles.strong(state.message);

  /**
   * Prompt hint
   */

  elements.hint = (state, status) => {
    return status === 'pending' ? styles.muted(state.hint) : '';
  };

  /**
   * Prompt prefix
   */

  elements.prefix = {
    default: styles.info(symbols.question),
    answered: styles.success(symbols.check),
    cancelled: styles.danger(symbols.cross),
    pending: styles.info(symbols.question),
    collapsed: styles.muted(symbols.plus),
    expanded: styles.muted(symbols.minus),
    completing() {
      throw new Error('completing prefix not implemented yet');
    }
  };

  /**
   * Prompt separator
   */

  elements.separator = {
    answered: styles.muted(symbols.middot),
    cancelled: styles.muted(symbols.ellipsis),
    completing: styles.muted(symbols.ellipsis),
    pending: styles.muted(symbols.pointerSmall)
  };

  /**
   * Choice pointer >
   */

  elements.pointer = {
    on: symbols.pointer,
    get off() {
      return ' '.repeat(this.on.trim().length);
    }
  };

  /**
   * Choice indicator ◉
   */

  elements.indicator = symbols.radio;

  return utils.merge(elements, options.elements);
};
