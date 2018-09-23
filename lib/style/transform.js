'use strict';

const styles = require('./styles');

module.exports = (options = {}) => {
  const style = styles(options);

  const transforms = {
    default: {
      scale: 1,
      render: (input = '') => `${input}`,
      answer: (input = '') => `${input}`
    },
    number: {
      scale: 1,
      render: (input = '') => input ? Number(input) : 0,
      answer(input = '') {
        return this.render(input);
      }
    },
    invisible: {
      scale: 0,
      render: () => ''
    },
    password: {
      scale: 1,
      hint(input = '') {
        return style.hint(input);
      },
      render(input = '') {
        return style.hint('*'.repeat(input.length));
      },
      answer(input = '') {
        return style.info('*'.repeat(input.length));
      }
    },
    double: {
      scale: 2,
      render: (input = '') => [...input].map(v => `${v}${v}`).join('')
    },
    emoji: {
      scale: 2,
      render: (input = '') => '😃'.repeat(input.length),
      answer(input) {
        return this.render(input);
      }
    }
  };

  let opts = { ...transforms, ...options.transforms };
  return opts[options.style] || opts.default;
};
