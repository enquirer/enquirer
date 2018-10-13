'use strict';

const colors = require('ansi-colors');
const utils = require('../utils');

module.exports = prompt => {
  let ele = {};

  /**
   * Prompt header
   */

  ele.header = (state, status) => {
    let header = state.get('header', status, prompt);
    return header && status === 'pending' ? (header + '\n') : '';
  };

  /**
   * Prompt prefix: ?
   */

  ele.prefix = {
    pending() {
      return prompt.styles.info(prompt.symbols.question);
    },
    answered() {
      return prompt.styles.success(prompt.symbols.check);
    },
    cancelled() {
      return prompt.styles.cancelled(prompt.symbols.cross);
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
   * Prompt message
   */

  ele.message = (state, status) => {
    return prompt.styles.strong(state.get('message', status, prompt));
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
    state.error = void 0;
    return prefix + prompt.styles.danger.italic(error);
  };

  /**
   * Choice pointer: >
   */

  ele.pointer = {
    on() {
      let { pointer } = prompt.symbols;
      return prompt.styles.active(pointer.on || pointer);
    },
    get off() {
      let on = colors.unstyle(this.on()).trim();
      return ' '.repeat(on.length);
    },
    get default() {
      return this.on();
    }
  };

  /**
   * Choice indicator: ◉ / ◯
   */

  ele.indicator = {
    on() {
      let { indicator } = prompt.symbols;
      return prompt.styles.success(indicator.on || indicator);
    },
    off() {
      let { indicator } = prompt.symbols;
      return prompt.styles.dark(indicator.off || indicator.on || indicator);
    }
  };

  /**
   * Prompt footer
   */

  ele.footer = (state, status) => {
    let footer = prompt.styles.muted(state.get('footer', status, prompt));
    return footer && status === 'pending' ? ('\n' + footer) : '';
  };

  return utils.merge({}, ele, prompt.options.elements);
};
