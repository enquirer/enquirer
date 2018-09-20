'use strict';

const colors = require('ansi-colors');

const themes = {
  default: {
    initial: (value = '') => `${value}`,
    answer: (value = '') => colors.cyan(`${value}`),
    value: (value = '') => colors.unstyle(`${value}`),
    error: (value = '') => colors.red(`${value}`),
    hint: (value = '') => colors.dim(`${value}`)
  },
  number: {
    scale: 1,
    initial(value = '') {
      return this.render(value);
    },
    render(value) {
      return value ? Number(value) : 0;
    }
  },
  double: {
    scale: 2,
    initial(value = '') {
      return this.render(value);
    },
    render(value = '') {
      return [...value].map(v => `${v}${v}`).join('');
    }
  },
  invisible: {
    scale: 0,
    render: () => '',
    initial: () => ''
  },
  password: {
    scale: 1,
    render: (value = '') => colors.dim('*'.repeat(value.length)),
    initial(value = '') {
      return this.render(value);
    }
  },
  emoji: {
    scale: 2,
    render: (value = '') => '😃'.repeat(value.length),
    initial(value = '') {
      return this.render(value);
    }
  }
};

module.exports = (options = {}) => {
  let opts = { ...themes, ...options };
  return opts[options.style] || opts.default;
};
