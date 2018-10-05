'use strict';

const colors = require('ansi-colors');
const isWindows = process.platform === 'win32';
const utils = require('../utils');

const checkboxSymbols = {
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
symbols.mixin = (options = {}) => utils.mixin(symbols, options.symbols);
module.exports = symbols;
