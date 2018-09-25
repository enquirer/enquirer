'use strict';

const Events = require('events');
const assert = require('assert');
const colors = require('ansi-colors');
const ansi = exports.ansi = require('./style/ansi');
let isHidden = false;
let called = false;
let fns = [];

exports.unmute = color => {
  let name = color.stack.find(n => colors.keys.color.includes(n));
  if (name) {
    return colors[name];
  }
  let bg = color.stack.find(n => n.slice(2) === 'bg');
  if (bg) {
    return colors[name.slice(2)];
  }
  return str => str;
};

exports.inverse = color => {
  let name = color.stack.find(n => colors.keys.color.includes(n));
  if (name) {
    return colors['bg' + name[0].toUpperCase() + name.slice(1)].black;
  }
  let bg = color.stack.find(n => n.slice(2) === 'bg');
  if (bg) {
    return colors[name.slice(2)];
  }
  return str => str;
};

exports.unmask = (typed = '', initial = '', color = colors.dim, opposite, pos = 0) => {
  let inverse = opposite || exports.inverse(color);
  let unmuted = exports.unmute(color);

  if (initial && typed && initial === typed) {
    let res = unmuted(typed);
    if (pos === void 0 || pos === typed.length) {
      return res + inverse(' ');
    }
    return res;
  }

  if (typeof initial === 'string' && initial && typed && initial.startsWith(typed)) {
    let rest = initial.slice(typed.length + 1) || '';
    let init = initial[typed.length] || '';
    return unmuted(typed) + inverse(init) + color(rest);
  }

  let init = initial.slice(0, pos);
  let rest = initial.slice(pos);
  return unmuted(typed) ? (typed + inverse(' ')) : (inverse(init) + color(rest));
};

exports.isObject = val => val && typeof val === 'object' && !Array.isArray(val);

exports.define = (obj, key, value) => {
  Reflect.defineProperty(obj, key, { value });
};

exports.assign = (...args) => {
  let target = {};
  for (let obj of args) {
    if (exports.isObject(obj)) {
      for (let key of Object.keys(obj)) {
        let desc = Object.getOwnPropertyDescriptor(obj, key);
        Reflect.defineProperty(target, key, desc);
      }
    }
  }
  return target;
};

exports.merge = (a = {}, ...rest) => {
  if (!rest.length) return a;
  let target = exports.assign({}, a, ...rest);
  for (let obj of rest) {
    if (!obj) continue;
    for (let key of Object.keys(target)) {
      if (exports.isObject(obj[key])) {
        target[key] = exports.merge(a[key], obj[key]);
      }
    }
  }
  return target;
};

exports.first = (arr, fallback) => {
  assert(Array.isArray(arr), 'expected an array');
  let result = arr.find(exports.isValue);
  if (result === void 0) {
    return fallback;
  }
  return result;
};

exports.filter = arr => {
  assert(Array.isArray(arr), 'expected an array');
  return arr.filter(v => v !== '' && v != null);
};

exports.mixinEmitter = (obj, emitter) => {
  let proto = emitter.constructor.prototype;
  for (let key of Object.keys(proto)) {
    let val = proto[key];
    if (typeof val === 'function') {
      exports.define(obj, key, val.bind(emitter));
    } else {
      exports.define(obj, key, val);
    }
  }
};

exports.forwardEvents = (from, to) => {
  if (!to.emit) exports.mixinEmitter(to, new Events());
  from.once('submit', to.emit.bind(to, 'submit'));
  from.once('cancel', to.emit.bind(to, 'cancel'));
  from.once('run', to.emit.bind(to, 'run'));
  return to;
};

exports.defineExport = (obj, key, fn) => {
  let custom;
  Reflect.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    set(val) {
      custom = val;
    },
    get() {
      return custom ? custom() : fn();
    }
  });
};

exports.hide = stream => {
  if (isHidden) return;
  isHidden = true;
  stream.write(ansi.cursor.hide);
  exports.onExit(() => stream.write(ansi.cursor.show));
};

exports.show = stream => {
  isHidden = false;
  stream.write(ansi.cursor.show);
};

exports.onExit = callback => {
  const onExit = (quit, code) => {
    if (called) return;

    called = true;
    fns.forEach(fn => fn());

    if (quit === true) {
      process.exit(128 + code);
    }
  };

  if (fns.length === 0) {
    process.once('SIGTERM', onExit.bind(null, true, 15));
    process.once('SIGINT', onExit.bind(null, true, 2));
    process.once('beforeExit', onExit);
  }

  fns.push(callback);
};
