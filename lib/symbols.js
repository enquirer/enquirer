'use strict';

const isWindows = process.platform === 'win32';
const colors = require('ansi-colors');
const utils = require('./utils');

const symbols = {
  prefix: {
    pending: colors.symbols.question,
    submitted: colors.symbols.check,
    cancelled: colors.symbols.cross
  },
  separator: {
    pending: colors.symbols.pointerSmall,
    submitted: colors.symbols.middot,
    cancelled: colors.symbols.middot
  },
  indicator: colors.symbols.check,
  hexagon: { off: '⬡', on: '⬢', disabled: '⬢' },
  ballot: { on: '☑', off: '☐', disabled: '☒' },
  stars: { on: '★', off: '☆', disabled: '☆' },
  folder: { on: '▼', off: '▶', disabled: '▶' },
  radio: {
    off: isWindows ? '( )' : '◯',
    on: isWindows ? '(*)' : '◉',
    disabled: isWindows ? '(|)' : 'Ⓘ'
  }
};

symbols.merge = options => {
  let result = utils.merge({}, colors.symbols, symbols, options.symbols);
  delete result.merge;
  return result;
};

module.exports = symbols;

