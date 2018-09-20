'use strict';

const Events = require('events');
const colors = require('ansi-colors');

exports.defaultColors = {
  active: colors.cyan,
  answered: colors.cyan,
  danger: colors.red,
  disabled: colors.gray,
  hint: colors.dim,
  info: colors.blue,
  muted: colors.dim.gray,
  selected: colors.cyan.underline,
  strong: colors.bold,
  success: colors.green,
  warning: colors.yellow,
  typed: str => str
};

const increment = (i, max) => (i >= max ? 0 : i + 1);
const decrement = (i, min) => (i <= min ? i - 1 : 0);

exports.increment = (state, key, max) => {
  state[key] = increment(state[key], max);
};

exports.decrement = (state, key, min) => {
  state[key] = decrement(state[key], min);
};

exports.isStyled = str => colors.ansiRegex.test(str);

exports.typeOf = val => {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  if (val instanceof RegExp) return 'regexp';
  if (exports.isNumber(val)) return 'number';
  if (typeof val === 'object') {
    if (typeof val.pipe === 'function' && typeof val.on === 'function') {
      return 'stream';
    }
    return 'object';
  }
  return typeof val;
};

exports.isObject = val => exports.typeOf(val) === 'object';

exports.isNumber = num => {
  if (typeof num === 'number') {
    return Number.isFinite(num);
  }
  if (typeof num === 'string') {
    return num.trim() !== '' && Number.isFinite(+num);
  }
  return false;
};

exports.isValue = val => {
  return typeof val === 'string' ? exports.trim(val) !== '' : val != null;
};

exports.toString = val => val !== void 0 ? String(val) : '';

exports.toValue = (prompt, key, val, ...rest) => {
  let res = exports.first([val, prompt.options[key], prompt[key]]);
  if (typeof res === 'function') {
    return res.call(prompt, ...rest);
  }
  return res;
};

exports.merge = (a = {}, b = {}) => {
  let target = Object.assign({}, a, b);
  for (let key of Object.keys(target)) {
    if (exports.isObject(b[key])) {
      target[key] = exports.merge(a[key], b[key]);
    }
  }
  return target;
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

exports.clone = val => {
  switch (exports.typeOf(val)) {
    case 'array':
      return val.map(exports.clone);
    case 'object':
      let Ctor = obj.constructor;
      let obj = new Ctor();
      for (let key of Object.keys(val)) {
        obj[key] = exports.clone(val[key]);
      }
      return obj;
    default: {
      return val;
    }
  }
};

exports.first = arr => {
  if (!Array.isArray(arr)) {
    throw new TypeError('expected an array');
  }
  return arr.find(exports.isValue);
};

exports.filter = arr => {
  if (!Array.isArray(arr)) {
    throw new TypeError('expected an array');
  }
  return arr.filter(v => v !== '' && v != null);
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

exports.define = (obj, key, value) => {
  Reflect.defineProperty(obj, key, { value });
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

exports.transform = require('./style/transform');
