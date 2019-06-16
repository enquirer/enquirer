'use strict';

const colors = require('ansi-colors');
const utils = require('./utils');

exports.header = prompt => {
  if (prompt.status === 'pending') {
    return prompt.element('header');
  }
};

exports.prefix = async prompt => {
  let element = (await prompt.element('prefix')) || prompt.symbols;

  if (utils.isObject(element)) {
    element = element[prompt.status] || element.pending;
    element = element ? await prompt.resolve(element, prompt.state) : '';
  }

  if (!utils.hasColor(element)) {
    let style = prompt.styles[prompt.status] || prompt.styles.pending;
    return style(element);
  }

  return element;
};

exports.message = async prompt => {
  let element = await prompt.element('message');
  if (element != null && !utils.hasColor(element)) {
    return prompt.styles.strong(element.trim());
  }
  return element;
};

exports.separator = async prompt => {
  let element = (await prompt.element('separator')) || prompt.symbols;

  if (utils.isObject(element)) {
    element = element[prompt.status] || prompt.state.separator || element.pending;
    element = element ? await prompt.resolve(element, prompt.state) : '';
  }

  if (utils.isObject(element)) {
    element = element[prompt.status] || element.pending;
  }

  if (typeof element === 'string' && !utils.hasColor(element)) {
    return prompt.styles.muted(element.trim());
  }

  return element;
};

exports.hint = async prompt => {
  if (prompt.status === 'pending' && !prompt.isValue(prompt.state.input)) {
    let hint = await prompt.element('hint');

    if (!utils.hasColor(hint)) {
      return prompt.styles.muted(hint);
    }

    return hint;
  }
};

exports.body = () => null;

exports.pointer = async(prompt, choice, i) => {
  let pointer = await prompt.element('pointer', choice, i);

  if (typeof pointer === 'string' && utils.hasColor(pointer)) {
    return pointer;
  }

  if (pointer) {
    let styles = prompt.styles;
    let focused = prompt.index === i;
    let style = focused ? styles.primary : pointer => pointer;
    let val = pointer[focused ? 'on' : 'off'];
    let ele = await prompt.resolve(val || pointer, prompt.state);
    let styled = !utils.hasColor(ele) ? style(ele) : ele;
    return focused ? styled : ' '.repeat(ele.length);
  }
};

exports.indicator = async(prompt, choice, i) => {
  let indicator = await prompt.element('indicator', choice, i);
  if (typeof indicator === 'string' && utils.hasColor(indicator)) {
    return indicator;
  }
  if (indicator) {
    let styles = prompt.styles;
    let enabled = choice.enabled === true;
    let style = enabled ? styles.success : styles.dark;
    let ele = indicator[enabled ? 'on' : 'off'] || indicator;
    return !utils.hasColor(ele) ? style(ele) : ele;
  }
  return '';
};

exports.footer = async prompt => {
  if (prompt.status === 'pending') {
    let footer = await prompt.element('footer');

    if (typeof footer === 'string') {
      let opts = { width: prompt.width, indent: prompt.margin[3] };
      let names = utils.detectColors(footer);
      let color = colors.noop;
      let str = footer;

      if (utils.isSingleColor(str, names)) {
        str = colors.unstyle(str);
        color = colors[names[0]];
      }

      return prompt.margin[2] + color(utils.wordWrap(str, opts));
    }
  }
};
