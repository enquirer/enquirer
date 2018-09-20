'use strict';

const colors = require('ansi-colors');

const transforms = {
  default: {
    scale: 1,
    initial: (val = '') => `${val}`,
    render: (val = '') => `${val}`,
    answer: (val = '') => `${val}`
  },
  number: {
    scale: 1,
    render: (val = '') => val ? Number(val) : 0,
    initial: (val = '') => val !== void 0 ? Number(val) : '',
    answer(val = '') {
      return this.render();
    }
  },
  double: {
    scale: 2,
    render: (val = '') => [...val].map(v => `${v}${v}`).join(''),
    initial(val = '') {
      return this.render(val);
    }
  },
  invisible: {
    scale: 0,
    render: () => '',
    initial: () => '',
    answer: () => ''
  },
  password: {
    scale: 1,
    hint: (val = '') => colors.dim(val),
    render: (val = '') => colors.dim('*'.repeat(val.length)),
    initial(val) {
      return this.render(val);
    },
    answer(val) {
      return colors.cyan(this.render(val));
    }
  },
  emoji: {
    scale: 2,
    render: (val = '') => '😃'.repeat(val.length),
    initial(val) {
      return this.render(val);
    },
    answer(val) {
      return this.render(val);
    }
  }
};

module.exports = (options = {}) => {
  let opts = { ...transforms, ...options };
  return opts[options.style] || opts.default;
};
