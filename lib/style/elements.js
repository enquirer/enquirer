'use strict';

const utils = require('../utils');

module.exports = prompt => {
  let ele = {};

  /**
   * Prompt message
   */

  ele.message = state => prompt.styles.strong(state.message);

  /**
   * Prompt hint
   */

  ele.hint = (state, status) => {
    let hint = typeof state.hint === 'function' ? state.hint.call(prompt) : state.hint;
    return status === 'pending' ? prompt.styles.muted(hint) : '';
  };

  /**
   * Prompt header
   */

  ele.header = (state, status) => {
    return status === 'pending' ? (state.header + '\n') : '';
  };

  /**
   * Prompt footer
   */

  ele.footer = (state, status) => {
    return status === 'pending' ? ('\n' + state.footer) : '';
  };

  /**
   * Prompt prefix: ?
   */

  ele.prefix = {
    default() {
      return prompt.styles.info(prompt.symbols.question);
    },
    pending() {
      return prompt.styles.info(prompt.symbols.question);
    },
    answered() {
      return prompt.styles.success(prompt.symbols.check);
    },
    cancelled() {
      return prompt.styles.danger(prompt.symbols.cross);
    },
    collapsed() {
      return prompt.styles.muted(prompt.symbols.plus);
    },
    expanded() {
      return prompt.styles.muted(prompt.symbols.minus);
    },
    completing() {
      throw new Error('completing prefix not implemented yet');
    }
  };

  /**
   * Prompt separator
   */

  ele.separator = {
    answered() {
      return prompt.styles.muted(prompt.symbols.middot);
    },
    cancelled() {
      return prompt.styles.muted(prompt.symbols.ellipsis);
    },
    completing() {
      return prompt.styles.muted(prompt.symbols.ellipsis);
    },
    pending() {
      return prompt.styles.muted(prompt.symbols.pointerSmall);
    }
  };

  /**
   * Choice pointer: >
   */

  ele.pointer = {
    on: prompt.symbols.pointer,
    get off() {
      return ' '.repeat(this.on.trim().length);
    }
  };

  /**
   * Choice indicator: ◉ / ◯
   */

  ele.indicator = prompt.symbols.radio;

  return utils.mixin(ele, prompt.options.elements);
};
