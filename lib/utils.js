import colors from './vendor/ansi-colors/index.js';

const toString = Object.prototype.toString;
let onExitCalled = false;
let onExitCallbacks = new Set();

const utils = Object.create({})

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

utils.longest = (arr, prop) => {
  return arr.reduce((a, v) => Math.max(a, prop ? v[prop].length : v.length), 0);
};

utils.hasColor = str => !!str && colors.hasColor(str);

const isObject = utils.isObject = val => {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
};

utils.nativeType = val => {
  return toString.call(val).slice(8, -1).toLowerCase().replace(/\s/g, '');
};

utils.isAsyncFn = val => {
  return utils.nativeType(val) === 'asyncfunction';
};

utils.isPrimitive = val => {
  return val != null && typeof val !== 'object' && typeof val !== 'function';
};

utils.resolve = (context, value, ...rest) => {
  if (typeof value === 'function') {
    return value.call(context, ...rest);
  }
  return value;
};

utils.scrollDown = (choices = []) => [...choices.slice(1), choices[0]];
utils.scrollUp = (choices = []) => [choices.pop(), ...choices];

utils.reorder = (arr = []) => {
  let res = arr.slice();
  res.sort((a, b) => {
    if (a.index > b.index) return 1;
    if (a.index < b.index) return -1;
    return 0;
  });
  return res;
};

utils.swap = (arr, index, pos) => {
  let len = arr.length;
  let idx = pos === len ? 0 : pos < 0 ? len - 1 : pos;
  let choice = arr[index];
  arr[index] = arr[idx];
  arr[idx] = choice;
};

utils.width = (stream, fallback = 80) => {
  let columns = (stream && stream.columns) ? stream.columns : fallback;
  if (stream && typeof stream.getWindowSize === 'function') {
    columns = stream.getWindowSize()[0];
  }
  if (process.platform === 'win32') {
    return columns - 1;
  }
  return columns;
};

utils.height = (stream, fallback = 20) => {
  let rows = (stream && stream.rows) ? stream.rows : fallback;
  if (stream && typeof stream.getWindowSize === 'function') {
    rows = stream.getWindowSize()[1];
  }
  return rows;
};

utils.wordWrap = (str, options = {}) => {
  if (!str) return str;

  if (typeof options === 'number') {
    options = { width: options };
  }

  let { indent = '', newline = ('\n' + indent), width = 80 } = options;
  let spaces = (newline + indent).match(/[^\S\n]/g) || [];
  width -= spaces.length;
  let source = `.{1,${width}}([\\s\\u200B]+|$)|[^\\s\\u200B]+?([\\s\\u200B]+|$)`;
  let output = str.trim();
  let regex = new RegExp(source, 'g');
  let lines = output.match(regex) || [];
  lines = lines.map(line => line.replace(/\n$/, ''));
  if (options.padEnd) lines = lines.map(line => line.padEnd(width, ' '));
  if (options.padStart) lines = lines.map(line => line.padStart(width, ' '));
  return indent + lines.join(newline);
};

utils.unmute = color => {
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

utils.pascal = str => str ? str[0].toUpperCase() + str.slice(1) : '';

utils.inverse = color => {
  if (!color || !color.stack) return color;
  let name = color.stack.find(n => colors.keys.color.includes(n));
  if (name) {
    let col = colors['bg' + utils.pascal(name)];
    return col ? col.black : color;
  }
  let bg = color.stack.find(n => n.slice(0, 2) === 'bg');
  if (bg) {
    return colors[bg.slice(2).toLowerCase()] || color;
  }
  return colors.none;
};

utils.complement = color => {
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
    return colors['bg' + utils.pascal(comp)] || color;
  }
  return colors.none;
};

utils.meridiem = date => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  let hrs = hours === 0 ? 12 : hours;
  let min = minutes < 10 ? '0' + minutes : minutes;
  return hrs + ':' + min + ' ' + ampm;
};

/**
 * Set a value on the given object.
 * @param {Object} obj
 * @param {String} prop
 * @param {any} value
 */

utils.set = (obj = {}, prop = '', val) => {
  return prop.split('.').reduce((acc, k, i, arr) => {
    let value = arr.length - 1 > i ? (acc[k] || {}) : val;
    if (!utils.isObject(value) && i < arr.length - 1) value = {};
    return (acc[k] = value);
  }, obj);
};

/**
 * Get a value from the given object.
 * @param {Object} obj
 * @param {String} prop
 */

utils.get = (obj = {}, prop = '', fallback) => {
  let value = obj[prop] == null
    ? prop.split('.').reduce((acc, k) => acc && acc[k], obj)
    : obj[prop];
  return value == null ? fallback : value;
};

utils.mixin = (target, b) => {
  if (!isObject(target)) return b;
  if (!isObject(b)) return target;
  for (let key of Object.keys(b)) {
    let desc = Object.getOwnPropertyDescriptor(b, key);
    if (hasOwnProperty.call(desc, 'value')) {
      if (hasOwnProperty.call(target, key) && isObject(desc.value)) {
        let existing = Object.getOwnPropertyDescriptor(target, key);
        if (isObject(existing.value) && existing.value !== desc.value) {
          target[key] = utils.merge({}, target[key], b[key]);
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

utils.merge = (...args) => {
  let target = {};
  for (let ele of args) utils.mixin(target, ele);
  return target;
};

utils.mixinEmitter = (obj, emitter) => {
  let proto = emitter.constructor.prototype;
  for (let key of Object.keys(proto)) {
    let val = proto[key];
    if (typeof val === 'function') {
      utils.define(obj, key, val.bind(emitter));
    } else {
      utils.define(obj, key, val);
    }
  }
};

const onExit = (quit, code) => {
  if (onExitCalled) return;

  onExitCalled = true;
  onExitCallbacks.forEach(fn => fn());

  if (quit === true) {
    process.exit(128 + code);
  }
};
const onSigTerm = onExit.bind(null, true, 15);
const onSigInt = onExit.bind(null, true, 2);

utils.onExit = callback => {
  if (onExitCallbacks.size === 0) {
    process.once('SIGTERM', onSigTerm);
    process.once('SIGINT', onSigInt);
    process.once('exit', onExit);
  }

  onExitCallbacks.add(callback);

  return () => {
    onExitCallbacks.delete(callback);
    if (onExitCallbacks.size === 0) {
      process.off('SIGTERM', onSigTerm);
      process.off('SIGINT', onSigInt);
      process.off('exit', onExit);
    }
  }
};

utils.define = (obj, key, value) => {
  Reflect.defineProperty(obj, key, { value });
};

utils.defineExport = (obj, key, fn) => {
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

export default utils