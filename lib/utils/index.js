'use strict';

const Events = require('events');
const assert = require('assert');
const colors = require('ansi-colors');
const complements = {
  'yellow': 'blue',
  'cyan': 'red',
  'green': 'magenta',
  'black': 'white',

  'blue': 'yellow',
  'red': 'cyan',
  'magenta': 'green',
  'white': 'black'
};

let called = false;
let fns = [];

exports.increment = (i, max) => (i < max ? i + 1 : max);
exports.decrement = (i, min) => (i > min ? i - 1 : min);

exports.parse = (argv = []) => {
  let opts = {};
  for (let arg of argv) {
    if (arg.slice(0, 2) === '--') {
      let segs = arg.slice(2).split('=');
      opts[segs[0]] = segs[1] || true;
    }
  }
  return opts;
};

exports.reorder = (arr = []) => {
  let res = arr.slice();
  res.sort((a, b) => {
    if (a.index > b.index) return 1;
    if (a.index < b.index) return -1;
    return 0;
  });
  return res;
};

exports.width = (stream, fallback = 80) => {
  let columns = stream.columns || fallback;
  if (typeof stream.getWindowSize === 'function') {
    columns = stream.getWindowSize()[0];
  }
  if (process.platform === 'win32') {
    return columns - 1;
  }
  return columns;
};

exports.wordWrap = (str, options = {}) => {
  if (!str) return str;

  if (typeof options === 'number') {
    options = { width: options };
  }

  let { indent = '', newline = ('\n' + indent), width = 50 } = options;
  let source = `.{1,${width}}([\\s\\u200B]+|$)|[^\\s\\u200B]+?([\\s\\u200B]+|$)`;
  let output = str.trim();
  let regex = new RegExp(source, 'g');
  let lines = output.match(regex) || [];
  return indent + lines.map(line => line.replace(/\n$/, '')).join(newline);
};

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

exports.pascal = str => str ? str[0].toUpperCase() + str.slice(1) : '';

exports.inverse = color => {
  if (!color || !color.stack) return color;
  let name = color.stack.find(n => colors.keys.color.includes(n));
  if (name) {
    let col = colors['bg' + exports.pascal(name)];
    return col ? col.black : color;
  }
  let bg = color.stack.find(n => n.slice(0, 2) === 'bg');
  if (bg) {
    return colors[bg.slice(2).toLowerCase()] || color;
  }
  return colors.none;
};

exports.complement = color => {
  if (!color || !color.stack) return color;
  let name = color.stack.find(n => colors.keys.color.includes(n));
  let bg = color.stack.find(n => n.slice(0, 2) === 'bg');
  if (name && !bg) {
    return colors[complements[name] || name];
  }
  if (bg) {
    let lower = bg.slice(2).toLowerCase();
    let comp = complements[lower];
    if (!comp) return color;
    return colors['bg' + exports.pascal(comp)] || color;
  }
  return colors.none;
};

const isObject = exports.isObject = val => {
  return val && typeof val === 'object' && !Array.isArray(val);
};

exports.isNumber = val => typeof val === 'number';
exports.round = (num, precision) => {
  let pow = Math.pow(10, precision);
  return Math.round(num * pow) / pow;
};

exports.define = (obj, key, value) => {
  Reflect.defineProperty(obj, key, { value });
};

exports.mixin = (target, b) => {
  if (!isObject(target)) return b;
  if (!isObject(b)) return target;
  for (let key of Object.keys(b)) {
    let desc = Object.getOwnPropertyDescriptor(b, key);
    if (desc.hasOwnProperty('value')) {
      if (target.hasOwnProperty(key) && isObject(desc.value)) {
        let existing = Object.getOwnPropertyDescriptor(target, key);
        if (isObject(existing.value)) {
          target[key] = exports.merge({}, target[key], b[key]);
        } else {
          Reflect.defineProperty(target, key, desc);
        }
      } else {
        Reflect.defineProperty(target, key, desc);
      }
    } else {
      Reflect.defineProperty(target, key, desc);
    }
  }
  return target;
};

exports.merge = (...args) => {
  let target = {};
  for (let ele of args) exports.mixin(target, ele);
  return target;
};

exports.trim = val => {
  if (val !== void 0 && typeof val !== 'string') return '';
  return val ? val.trim() : '';
};

exports.isValue = val => {
  return typeof val === 'string' ? exports.trim(val) !== '' : val != null;
};

exports.first = (type, arr) => {
  if (typeof type === 'string') return arr.find(v => typeof v === type);
  return type.find(v => v != null);
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
  from.once('state', to.emit.bind(to, 'state'));
  from.once('submit', to.emit.bind(to, 'submit'));
  from.once('cancel', to.emit.bind(to, 'cancel'));
  from.once('close', to.emit.bind(to, 'close'));
  from.once('run', to.emit.bind(to, 'run'));
  return to;
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
    process.once('exit', onExit);
  }

  fns.push(callback);
};

const defineExport = exports.defineExport = (obj, key, fn) => {
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

exports.noop = val => val;
defineExport(exports, 'action', () => require('./action'));
defineExport(exports, 'choice', () => require('./choice'));
defineExport(exports, 'choices', () => require('./choices'));
defineExport(exports, 'interpolate', () => require('./interpolate'));
defineExport(exports, 'keypress', () => require('./keypress'));
defineExport(exports, 'placeholder', () => require('./placeholder'));
