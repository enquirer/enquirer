'use strict';

const readline = require('readline');

const increment = (i, max) => i >= max ? 0 : i + 1;
const decrement = (i, min) => i <= min ? i - 1 : 0;

exports.first = (...args) => {
  return [].concat.apply([], args).find(v => v != null && v !== '');
};

exports.increment = (state, key, max) => {
  state[key] = increment(state[key], max);
};

exports.decrement = (state, key, min) => {
  state[key] = decrement(state[key], min);
};

exports.syncState = (prompt, keys = []) => {
  for (let key of keys) {
    Reflect.defineProperty(prompt, key, {
      set(val) {
        prompt.state[key] = val;
      },
      get() {
        return prompt.state[key];
      }
    });
  }
};

// exports.createInterface = prompt => {
//   let rl = readline.createInterface({ input: prompt.stdin, terminal: true });
//   readline.emitKeypressEvents(prompt.stdin, rl);
//   return rl;
// };
exports.createInterface = options => {
  let opts = { terminal: true, ...options };
  let { input, terminal } = opts;
  let rl = readline.createInterface({ input, terminal });
  readline.emitKeypressEvents(input, rl);
  process.setMaxListeners(0);
  input.setMaxListeners(0);
  rl.setMaxListeners(0);
  return rl;
};

exports.resolveValue = (thisArg, value, ...rest) => {
  if (typeof value === 'function') {
    return value.call(thisArg, ...rest);
  }
  return value;
};

exports.toValue = (prompt, key, val, ...rest) => {
  let value = exports.first(val, prompt.options[key], prompt[key]);
  if (typeof value === 'function') {
    return value.call(prompt, ...rest);
  }
  return value;
};

exports.trim = val => {
  if (val !== void 0 && typeof val !== 'string') return '';
  return val ? val.trim() : '';
};

exports.isValue = val => {
  return val && (typeof val !== 'string' || !!exports.trim(val));
};
