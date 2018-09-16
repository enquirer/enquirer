'use strict';

const colors = require('ansi-colors');
const isTerminalApp = process.env.TERM_PROGRAM === 'Apple_Terminal';
const isNumber = val => typeof val === 'number';
const ESC = '\u001B[';
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';

const cursor = {
  left: `${ESC}G`,
  hide: `${ESC}?25l`,
  show: `${ESC}?25h`,
  savePosition: ESC + (isTerminalApp ? '7' : 's'),
  restorePosition: ESC + (isTerminalApp ? '8' : 'u'),
  getPosition: `${ESC}6n`,

  up: (count = 1) => `${ESC}${count}A`,
  down: (count = 1) => `${ESC}${count}B`,
  forward: (count = 1) => `${ESC}${count}C`,
  backward: (count = 1) => `${ESC}${count}D`,
  nextLine: (count = 1) => `${ESC}E`.repeat(count),
  prevLine: (count = 1) => `${ESC}F`.repeat(count),

  to(x, y) {
    return isNumber(y) ? `${ESC}${y + 1};${x + 1}H` : `${ESC}${x + 1}G`;
  },
  move(x, y) {
    let res = '';
    res += (x < 0) ? `${ESC}${-x}D` : (x > 0) ? `${ESC}${x}C` : '';
    res += (y < 0) ? `${ESC}${-y}A` : (y > 0) ? `${ESC}${y}B` : '';
    return res;
  }
};

const scroll = {
  up(count = 1) {
    return `${ESC}S`.repeat(count);
  },
  down(count = 1) {
    return `${ESC}T`.repeat(count);
  }
};

const erase = {
  screen: `${ESC}2J`,
  up: `${ESC}1J`,
  down: `${ESC}J`,
  line: `${ESC}2K`,
  lineEnd: `${ESC}K`,
  lineStart: `${ESC}1K`
};

erase.lines = count => {
  let clear = '';
  for (let i = 0; i < count; i++) {
    clear += erase.line + (i < count - 1 ? cursor.up() : '');
  }
  if (count) clear += cursor.left;
  return clear;
};

const link = (text, url) => {
  return [OSC, '8', SEP, SEP, url, BEL, text, OSC, '8', SEP, SEP, BEL].join('');
};

const image = (buf, options = {}) => {
  let res = `${OSC}1337;File=inline=1`;
  if (options.width) res += `;width=${options.width}`;
  if (options.height) res += `;height=${options.height}`;
  if (options.preserveAspectRatio === false) {
    res += ';preserveAspectRatio=0';
  }
  return `${res}:${buf.toString('base64')}${BEL}`;
};

const iTerm = {
  setCwd(cwd = process.cwd()) {
    return `${OSC}50;CurrentDir=${cwd}${BEL}`;
  }
};

const clear = (message, columns = process.stdout.columns) => {
  if (!columns) return erase.line + cursor.to(0);
  let width = str => [...colors.unstyle(str)].length;
  let lines = message.split(/\r?\n/);
  let rows = 0;
  for (let line of lines) {
    rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / columns);
  }
  return (erase.line + cursor.prevLine()).repeat(rows - 1) + erase.line + cursor.to(0);
};

module.exports = {
  cursor,
  scroll,
  erase,
  clear,
  beep: BEL,
  bell: BEL,
  link,
  image,
  iTerm
};
