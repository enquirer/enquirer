'use strict';

const utils = require('../utils');

module.exports = prompt => {
  let ele = {};

  /**
   * Prompt message
   */

  ele.message = (state, status) => {
    return prompt.styles.strong(state.get('message', status, prompt));
  };

  /**
   * Prompt hint
   */

  ele.hint = (state, status) => {
    if (status !== 'pending') return '';
    let hint = state.get('hint', status, prompt);
    if (typeof hint !== 'string') return '';
    return prompt.styles.muted(hint);
  };

  /**
   * Prompt error
   */

  ele.error = (state, status) => {
    if (status !== 'pending') return '';
    let error = state.get('error', status, prompt);
    if (typeof error !== 'string') return '';
    let prefix = '\n' + prompt.symbols.pointerSmall + ' ';
    return prefix + prompt.styles.danger.italic(error);
  };

  /**
   * Prompt header
   */

  ele.header = (state, status) => {
    let header = state.get('header', status, prompt);
    return header && status === 'pending' ? (header + '\n') : '';
  };

  /**
   * Prompt footer
   */

  ele.footer = (state, status) => {
    let footer = state.get('footer', status, prompt);
    return footer && status === 'pending' ? ('\n' + footer) : '';
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

  return utils.merge({}, ele, prompt.options.elements);
};
