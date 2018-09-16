'use strict';

const Events = require('events');
const colors = require('ansi-colors');
const readline = require('readline');
const define = (name, fn) => Reflect.defineProperty(exports, name, { get: fn });
const strip = str => str.replace(/\\(?=\.)/g, '');
const split = str => str.split(/(?<!\\)\./).map(strip);

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

/**
 * Set a value on the given object.
 * @param {Object} obj
 * @param {String} prop
 * @param {any} value
 */

exports.set = (obj = {}, prop = '', val) => {
  return split(prop).reduce((acc, k, i, arr) => {
    let value = arr.length - 1 > i ? (acc[k] || {}) : val;
    if (!exports.isObject(value) && i < arr.length - 1) value = {};
    return (acc[k] = value);
  }, obj);
};

/**
 * Get a value from the given object.
 * @param {Object} obj
 * @param {String} prop
 */

exports.get = (obj = {}, prop = '', fallback) => {
  let value = obj[prop] == null
    ? split(prop).reduce((acc, k) => acc && acc[strip(k)], obj)
    : obj[prop];
  return value == null ? fallback : value;
};

/**
 * Create a readline interface with the given `options`.
 * @param {Object} `options`
 * @api public
 */

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

exports.height = (str = '') => str.split('\n').length;

exports.trim = val => {
  if (val !== void 0 && typeof val !== 'string') return '';
  return val ? val.trim() : '';
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

exports.isValidChar = ch => {
  if (ch && typeof ch === 'string') {
    let code = ch.charCodeAt(0);
    return code > 31 && code < 128;
  }
  return false;
};

exports.isEmpty = val => val == null;
exports.isNumber = val => /^[-0-9.]+$/.test(`${val}`.trim());
exports.isValue = val => {
  return val && (typeof val !== 'string' || !!exports.trim(val));
};

exports.isValidNumberKey = (n, choices) => {
  let num = +(String(n).trim());
  return exports.isNumber(n) && num >= 0 && num <= choices.length;
};

exports.isStyled = str => {
  return typeof str === 'string' && colors.unstyle(str) !== str;
};

exports.first = (...args) => args.find(val => !exports.isEmpty(val));

exports.round = (num, precision) => {
  let pow = Math.pow(10, precision);
  return Math.round(num * pow) / pow;
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

exports.define = (obj, key, value) => {
  Reflect.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable: true,
    value
  });
};

exports.isObject = val => {
  return val !== null && Object.prototype.toString.call(val) === '[object Object]';
};

exports.timeout = (fn, ms = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => fn().then(resolve).catch(reject), ms);
  });
};

/**
 * Expose helpers
 */

define('extras', () => require('./extras'));
define('action', () => require('./action'));
define('keypress', () => require('./keypress'));
define('symbols', () => require('./style/symbols'));
define('transform', () => require('./style/transform'));
define('spinner', () => require('./style/spinner'));
define('ansi', () => require('./style/ansi'));
