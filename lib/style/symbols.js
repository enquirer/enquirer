'use strict';

const colors = require('ansi-colors');
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const checkboxSymbols = {
  heart: '❤',
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

const windows = {
  bullet: '•',
  check: '√',
  cross: '×',
  ellipsis: '...',
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
  },
  ...checkboxSymbols
};

const other = {
  bullet: '•',
  check: '✔',
  cross: '✖',
  ballotCross: '✘',
  ellipsis: '…',
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
  },
  ...checkboxSymbols
};

const symbols = isWindows ? windows : other;

symbols.prefix = {
  answered: colors.green(symbols.check),
  cancelled: colors.red(symbols.cross),
  collapsed: colors.gray(symbols.plus),
  default: colors.cyan(symbols.question),
  expanded: colors.gray(symbols.minus),
  pending: colors.cyan(symbols.question)
};

symbols.pointer = {
  off: ' ',
  on: symbols.rightAngle,
  disabled: '  '
};

symbols.separator = {
  pending: symbols.ellipsis,
  answered: symbols.middot,
  default: symbols.ellipsis
};

symbols.indicator = symbols.radio;

module.exports = symbols;
