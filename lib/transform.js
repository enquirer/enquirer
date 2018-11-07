'use strict';

const colors = require('ansi-colors');
const utils = require('./utils');

const transforms = {
  default: { scale: 1, render: (input = '') => `${input}` },
  invisible: { scale: 0, render: () => ''},
  password: { scale: 1, render: (input = '') => colors.dim('*'.repeat(input.length)) },
  emoji: { scale: 2, render: (input = '') => '😃'.repeat(input.length) }
};

transforms.merge = (options = {}) => {
  let result = utils.merge({}, transforms, options.transforms);
  delete result.merge;
  return transforms[options.transform] || transforms.default;
};

module.exports = transforms;
