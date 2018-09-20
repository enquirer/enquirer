'use strict';

const schema = require('./schema');
const { typeOf, merge } = require('./utils');

const configure = module.exports = (prompt, options, type, shouldMerge = true) => {
  let group = schema[type] || schema.prompt;

  if (group !== schema.prompt && group.config.merge !== false) {
    group = merge(schema.prompt, group);
  }

  for (let key of Object.keys(schema)) {
    if (typeof schema[key].before === 'function') {
      schema[key].before(schema);
    }
  }

  let props = group.properties;
  let opts = { ...options };

  const set = key => {
    let value = opts[key];
    let prop = props[key];

    if (value === void 0) {
      value = prop.default;
    }

    if (typeof prop.resolve === 'function') {
      value = prop.resolve(value, opts, prompt);
    }

    if (value === void 0 && prop.required === true) {
      throw new TypeError(`options.${key} must be ${article(prop.type)}`);
    }

    if (value !== void 0 && prop.type.length && !prop.type.some(t => isValid(t, value))) {
      throw new TypeError(`options.${key} must be ${article(prop.type)}`);
    }

    if (value !== void 0) {
      prop.value = opts[key] = value;
    }
  };

  for (let key of Object.keys(opts)) {
    if (!props.hasOwnProperty(key)) {
      throw new Error(`option "${key}" is not supported`);
    }
  }

  for (let key of Object.keys(props)) set(key);
  return opts;
};

function article(types, plural = false) {
  let { kind, sub, subtypes } = parseType(types[0]);
  if (sub) {
    types[0] = kind + ' of ' + article(subtypes, true);
  }
  let a = plural ? '' : /^[aoe]/.test(types[0]) ? 'an ' : 'a ';
  if (types[0] === 'undefined' || types[0] === 'null') a = '';
  let s = plural ? 's' : '';
  let last = types.pop();
  if (types.length > 1) {
    types[types.length - 1] += ', or ' + last + s;
    return a + types.join(', ');
  }
  if (types.length === 1) {
    return a + types[0] + s + ' or ' + last + s;
  }
  return a + last + s;
}

function parseType(type) {
  let match = /^(\w+)(?:<([^>]+)>)?$/.exec(type);
  let [, kind, sub = ''] = match;
  let subtypes = sub.split('|');
  return { kind, sub, subtypes };
}

function isValid(type, value) {
  let { kind, sub, subtypes } = parseType(type);
  let isValid = typeOf(value) === kind;
  if (!isValid) return false;
  return sub ? value.every(v => subtypes.includes(typeOf(v))) : true;
}

// const Prompt = require('./prompt');
// const prompt = new Prompt({
//   name: 'foo',
//   choices: [{}],
//   message: 'bar',
//   initial: ''
// });

// console.log(configure(prompt.options));
// console.log(configure(prompt.options));
// console.log(configure(prompt.options));
// console.log(configure(prompt.options));

// console.log(article(['array<string>']))
// console.log(article(['array<string|object>', 'object']))
// console.log(article(['string']))
// console.log(article(['string', 'array']))
// console.log(article(['object', 'string', 'array']))
