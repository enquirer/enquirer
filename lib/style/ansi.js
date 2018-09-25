'use strict';

const isNumber = val => typeof val === 'number';
const isTerm = process.env.TERM_PROGRAM === 'Apple_Terminal';
const colors = require('ansi-colors');

const ESC = exports.esc = '\u001b[';
const cursor = exports.cursor = {
  beginning: `${ESC}G`,
  hide: `${ESC}?25l`,
  show: `${ESC}?25h`,

  savePosition: ESC + (isTerm ? '7' : 's'),
  restorePosition: ESC + (isTerm ? '8' : 'u'),
  getPosition: `${ESC}6n`,

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

  move(x, y) {
    let res = '';
    res += (x < 0) ? cursor.left(-x) : (x > 0) ? cursor.right(x) : '';
    res += (y < 0) ? cursor.up(-y) : (y > 0) ? cursor.down(y) : '';
    return res;
  },

  restore(str = '', pos = 0) {
    return cursor.move(-colors.unstyle(str).length + pos);
  }
};

const erase = exports.erase = {
  screen: `${ESC}2J`,
  up: `${ESC}1J`,
  down: `${ESC}J`,
  line: `${ESC}2K`,
  lineEnd: `${ESC}K`,
  lineStart: `${ESC}1K`,
  lines(count) {
    let clear = '';
    for (let i = 0; i < count; i++) {
      clear += erase.line + (i < count - 1 ? cursor.up() : '');
    }
    if (count) clear += cursor.left;
    return clear;
  }
};

exports.clear = (message, after = '') => {
  let msg = colors.unstyle(message);
  let lines = msg.split('\n').length;
  let linesAfter = after.split('\n').length;
  let codes = erase.line + cursor.prevLine();
  let len = lines - (linesAfter || 2);
  return codes.repeat(len) + erase.line + cursor.to(0);
};

exports.bell = exports.beep = '\u0007';
