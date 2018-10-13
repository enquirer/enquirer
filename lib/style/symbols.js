'use strict';

const colors = require('ansi-colors');
const isWindows = process.platform === 'win32';
const utils = require('../utils');

const checkboxSymbols = {
  indicator: colors.symbols.check,
  hexagon: {
    off: '⬡',
    on: '⬢'
  },
  ballot: {
    on: '☑',
    off: '☐',
    disabled: '☒'
  },
  stars: {
    on: '★',
    off: '☆',
    disabled: '☆'
  },
  folder: {
    on: '▼',
    off: '▶',
    disabled: '▶'
  },
  radio: {
    off: isWindows ? '( )' : '◯',
    on: isWindows ? '(*)' : '◉',
    disabled: isWindows ? '(|)' : 'Ⓘ'
  }
};

let symbols = { ...colors.symbols, ...checkboxSymbols };
symbols.merge = prompt => utils.merge({}, symbols, prompt.options.symbols);
module.exports = symbols;
