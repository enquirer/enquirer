'use strict';

const { typeOf, isObject } = require('./utils');

config.validate = (prompt, options = {}) => {
  for (let key of Object.keys(options)) {
    let val = options[key];
  }
};

config.merge = (prompt, options = {}) => {
  for (let key of Object.keys(options)) {
    let val = options[key];
  }
};

config.has = type => {
  let defaults = config[type];
  return key => {

  }
};

config.get = (key, value) => {
  const fallback = config.defaults[key];
  if (fallback === void 0) {
    // reminder: remove before publishing
    console.log('no config default exists for:', key);
    return;
  }
  const type = [].concat(fallback.type);
  if (value === void 0) {
    return fallback.value;
  }
  if (type.includes(value) && !type.includes(typeOf(value))) {
    throw new TypeError(`expected "options.${key}" to be a ${type}`);
  }
  return value;
};

module.exports = config;
