'use strict';

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
