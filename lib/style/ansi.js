'use strict';

const isTerm = process.env.TERM_PROGRAM === 'Apple_Terminal';
const colors = require('ansi-colors');
const { onExit, isNumber } = require('../utils');

/**
 * ANSI escape codes and convenience methods
 */

const ansi = module.exports = exports;
const ESC = '\u001b[';
const BEL = '\u0007';
let hidden = false;

const code = ansi.code = {
  bell: BEL,
  beginning: `${ESC}G`,
  down: `${ESC}J`,
  esc: ESC,
  getPosition: `${ESC}6n`,
  hide: `${ESC}?25l`,
  line: `${ESC}2K`,
  lineEnd: `${ESC}K`,
  lineStart: `${ESC}1K`,
  restorePosition: ESC + (isTerm ? '8' : 'u'),
  savePosition: ESC + (isTerm ? '7' : 's'),
  screen: `${ESC}2J`,
  show: `${ESC}?25h`,
  up: `${ESC}1J`
};

const cursor = ansi.cursor = {
  hide(stream) {
    if (hidden) return;
    hidden = true;
    stream.write(code.hide);
    onExit(() => stream.write(code.show));
  },
  show(stream) {
    hidden = false;
    stream.write(code.show);
  },
  get hidden() {
    return hidden;
  },

  forward: (count = 1) => `${ESC}${count}C`,
  backward: (count = 1) => `${ESC}${count}D`,
  nextLine: (count = 1) => `${ESC}E`.repeat(count),
  prevLine: (count = 1) => `${ESC}F`.repeat(count),

  up: (count = 1) => `${ESC}${count}A`,
  down: (count = 1) => `${ESC}${count}B`,
  right: (count = 1) => `${ESC}${count}C`,
  left: (count = 1) => `${ESC}${count}D`,

  to(x, y) {
    return isNumber(y) ? `${ESC}${y + 1};${x + 1}H` : `${ESC}${x + 1}G`;
  },

  move(x = 0, y = 0) {
    let res = '';
    res += (x < 0) ? cursor.left(-x) : (x > 0) ? cursor.right(x) : '';
    res += (y < 0) ? cursor.up(-y) : (y > 0) ? cursor.down(y) : '';
    return res;
  },

  restore(input = '', pos = 0) {
    return cursor.move(-colors.unstyle(input).length + pos);
  }
};

const erase = ansi.erase = {
  screen: code.screen,
  up: code.up,
  down: code.down,
  line: code.line,
  lineEnd: code.lineEnd,
  lineStart: code.lineStart,
  lines(n) {
    let str = '';
    for (let i = 0; i < n; i++) {
      str += ansi.erase.line + (i < n - 1 ? ansi.cursor.up(1) : '');
    }
    if (n) str += ansi.code.beginning;
    return str;
  }
};

// ansi.clear = (message, after = '') => {
//   let linesLen = message.split('\n').length;
//   let afterLen = after.split('\n').length;
//   if (afterLen > 1) {
//     return ansi.erase.lines(linesLen - afterLen);
//   }
//   let codes = erase.line + cursor.prevLine();
//   let len = linesLen - (afterLen || 1);
//   return codes.repeat(len) + erase.line + cursor.to(0);
// };

ansi.clear = (message, columns = process.stdout.columns) => {
  if (!columns) return erase.line + cursor.to(0);
  let width = str => [...colors.unstyle(str)].length;
  let lines = message.split(/\r?\n/);
  let rows = 0;
  for (let line of lines) {
    rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / columns);
  }
  return (erase.line + cursor.prevLine()).repeat(rows - 1) + erase.line + cursor.to(0);
};

ansi.bell = ansi.beep = BEL;
ansi.esc = ESC;
