'use strict';

const colors = require('ansi-colors');

const increment = (i, max) => (i >= max ? 0 : i + 1);
const decrement = (i, min) => (i <= min ? i - 1 : 0);

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

exports.isValue = val => {
  if (typeof val === 'string') return exports.trim(val) !== '';
  return val != null;
};

exports.toValue = (prompt, key, val, ...rest) => {
  let value = exports.utils.first(val, prompt.options[key], prompt[key]);
  if (typeof value === 'function') {
    return value.call(prompt, ...rest);
  }
  return value;
};

exports.firstValue = (...args) => {
  return [].concat.apply([], args).find(exports.isValue);
};

exports.resolveValue = (thisArg, value, ...rest) => {
  if (typeof value === 'function') {
    return value.call(thisArg, ...rest);
  }
  return value;
};

exports.trim = val => {
  if (val !== void 0 && typeof val !== 'string') return '';
  return val ? val.trim() : '';
};

exports.pad = (str, fn = val => val) => {
  return exports.padLeft(exports.padRight(str, fn), fn);
};

exports.padLeft = (str, fn = val => val) => {
  return str ? fn(str) + ' ' : '';
};

exports.padRight = (str, fn = val => val) => {
  return str ? ' ' + fn(str) : '';
};

exports.newline = (str, fn = val => val) => {
  return exports.newlineLeft(exports.newlineRight(str, fn), fn);
};

exports.newlineLeft = (str, fn = val => val) => {
  return str ? '\n' + fn(str) : '';
};

exports.newlineRight = (str, fn = val => val) => {
  return str ? fn(str) + '\n' : '';
};

exports.blend = (typed = '', initial = '') => {
  if (initial && typed && initial.startsWith(typed)) {
    return typed + colors.dim(initial.slice(typed.length));
  }
  return typed || colors.dim(initial);
};
