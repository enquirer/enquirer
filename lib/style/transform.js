'use strict';

const { dim } = require('ansi-colors');

const defaults = {
  default: {
    scale: 1,
    initial: (input = '') => `${input}`,
    render: (input = '') => `${input}`
  },
  number: {
    scale: 1,
    render: (input = '') => Number(input),
    initial: (input = '') => input !== void 0 ? Number(input) : ''
  },
  double: {
    scale: 2,
    render: (input = '') => [...input].map(v => `${v}${v}`).join(''),
    initial(input = '') {
      return this.render(input);
    }
  },
  invisible: {
    scale: 0,
    render: () => '',
    initial: () => ''
  },
  password: {
    scale: 1,
    render: (input = '') => dim('*'.repeat(input.length)),
    initial(input = '') {
      return this.render(input);
    }
  },
  emoji: {
    scale: 2,
    render: (input = '') => '😃'.repeat(input.length),
    initial(input = '') {
      return this.render(input);
    }
  }
};

module.exports = (options = {}) => {
  let transforms = { ...defaults, ...options.transforms };
  return transforms[options.style] || transforms.default;
};
