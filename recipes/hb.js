const ansi = require('../lib/ansi');
const { red } = require('ansi-colors');

const state = {
  time: 0,
  buffer: ''
};

process.on('exit', () => ansi.cursor.show());
process.stdout.write(ansi.cursor.hide());

const clear = () => {
  process.stdout.write(ansi.clear(state.buffer));
  state.buffer = '';
};

const write = () => {
  clear();
  let str = state.indicator;
  process.stdout.write(str);
  state.buffer += str;
};

const heartbeat = (i, ms = 200) => {
  let time = Date.now();
  if (time - state.time > ms) {
    state.time = time;
    state.indicator = frame(rhythm, i)('❤');
  }
  return state.indicator;
};

const rhythm = [red.dim, red, red.dim, red, red.dim, red.dim];
const frame = (arr, i) => arr[i % arr.length];

(function timeout(ms, i, fn) {
  setTimeout(() => {
    state.indicator = frame(rhythm, i)('❤');
    fn();
    timeout(ms, i + 1, fn);
  }, ms);
})(250, 0, write);
