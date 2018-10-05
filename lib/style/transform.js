'use strict';

const { mixin, placeholder } = require('../utils');

module.exports = prompt => {
  const options = prompt.options;
  const transforms = {
    default: {
      scale: 1,
      format(value, p) {
        let { answered, initial = '', input } = p;
        if (!answered && initial && typeof initial === 'string' && initial.startsWith(value)) {
          // return input + p.styles.placeholder(initial.slice(input.length));
          return placeholder(p, input, initial, prompt.cursor);
        }
        return p.styles.answered(value);
      },
      result: input => input
    },
    number: {
      scale: 1,
      format: input => input,
      result: input => input
    },
    invisible: {
      scale: 0,
      format: () => '',
      result: input => input
    },
    password: {
      scale: 1,
      format: (input = '') => {
        if (prompt.answered) {
          return prompt.styles.answered('*'.repeat(input.length));
        }
        return prompt.styles.placeholder('*'.repeat(input.length));
      },
      result: input => input
    },
    emoji: {
      scale: 2,
      format: (input = '') => '😃'.repeat(input.length),
      result: input => input
    }
  };

  if (typeof options.format === 'function') {
    let format = options.format.bind(prompt);
    return { scale: 1, format, result: format };
  }

  if (typeof options.result === 'function') {
    let result = options.result.bind(prompt);
    return { scale: 1, format: input => input, result };
  }

  let opts = mixin(transforms, options.transforms);
  return opts[options.style] || opts.default;
};
