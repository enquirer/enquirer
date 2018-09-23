'use strict';

const colors = require('ansi-colors');
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const utils = require('../utils');

const windows = {
  bullet: '•',
  check: '√',
  cross: '×',
  ellipsis: '...',
  heart: '❤',
  info: 'i',
  line: '─',
  middot: '·',
  minus: '－',
  plus: '＋',
  rightAngle: '>',
  rightAngleSmall: '»',
  question: '?',
  questionSmall: '﹖',
  warning: '‼',
  radio: {
    off: '( )',
    on: '(*)',
    disabled: '(|)'
  }
};

const other = {
  bullet: '•',
  check: '✔',
  cross: '✖',
  ballotCross: '✘',
  ellipsis: '…',
  heart: '❤',
  info: 'ℹ',
  line: '─',
  middot: '·',
  minus: '－',
  plus: '＋',
  rightAngle: isLinux ? '▸' : '❯',
  rightAngleSmall: isLinux ? '‣' : '›',
  question: '?',
  questionFull: '？',
  questionSmall: '﹖',
  warning: '⚠',
  radio: {
    off: '◯',
    on: '◉',
    disabled: 'Ⓘ'
  }
};

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
  }
};

let symbols = { ...(isWindows ? windows : other), ...checkboxSymbols };

symbols.prefix = {
  answered: colors.green(symbols.check),
  cancelled: colors.red(symbols.cross),
  collapsed: colors.dim(symbols.plus),
  default: colors.cyan(symbols.question),
  expanded: colors.dim(symbols.minus),
  pending: colors.cyan(symbols.question)
};

symbols.pointer = {
  off: ' ',
  on: symbols.rightAngle,
  disabled: '  '
};

symbols.separator = {
  default: colors.dim(symbols.ellipsis),
  cancelled: colors.dim(symbols.ellipsis),
  pending: colors.dim(symbols.rightAngleSmall),
  answered: colors.dim(symbols.middot),
  typing: colors.dim(symbols.ellipsis)
};

symbols.indicator = symbols.radio;

module.exports = (options = {}) => {
  let res = utils.merge(symbols, options.symbols);
  if (res === symbols) return symbols;
  for (let key of Object.keys(options)) {
    if (res.hasOwnProperty(key)) {
      res[key] = options[key];
    }
  }
  return res;
};
