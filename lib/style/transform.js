'use strict';

const { merge, placeholder } = require('../utils');

module.exports = prompt => {
  const options = prompt.options;
  const transforms = {
    default: {
      scale: 1,
      format(value) {
        let { answered, initial = '', input } = prompt;
        if (answered) {
          return prompt.styles.answered(value);
        }
        return placeholder(prompt, input, initial, prompt.cursor, options.showCursor);
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
    return { ...transforms.default, result: options.result };
  }

  let opts = merge({}, transforms, options.transforms);
  return opts[options.style] || opts.default;
};
