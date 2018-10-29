'use strict';

const colors = require('ansi-colors');

class Item {
  constructor(token) {
    this.name = token.key;
    this.value = token.default || '';
    this.message = token.message || this.name;
    this.cursor = 0;
    this.input = '';
  }
}

const tokenize = (options = {}, defaults = {}, fn = token => token) => {
  let unique = new Set();
  let input = options.template;
  let tokens = [];
  let items = [];
  let keys = [];
  let line = 1;

  let i = -1;
  let next = () => input[++i];
  let peek = () => input[i + 1];
  let push = token => {
    token.line = line;
    tokens.push(token);
  };

  push({ type: 'bos', value: '' });

  while (i < input.length - 1) {
    let value = next();

    if (value === '\r') {
      continue;
    }

    if (value === '\n') {
      push({ type: 'newline', value });
      line++;
      continue;
    }

    if (value === '\\') {
      value += next();
      push({ type: 'text', value });
      continue;
    }

    if ((value === '$' || value === '#') && peek() === '{') {
      value += next();
      let token = { type: 'template', open: value, inner: '', close: '', value };
      let ch;

      while ((ch = next())) {
        if (ch === '}') {
          token.value += ch;
          token.close = ch;
          break;
        }

        if (ch === ':') {
          token.default = '';
          token.key = token.inner;
        } else if (token.default !== void 0) {
          token.default += ch;
        }

        token.value += ch;
        token.inner += ch;
      }

      token.template = token.open + (token.default || token.inner) + token.close;
      token.key = token.key || token.inner;

      if (defaults.hasOwnProperty(token.key)) {
        token.default = defaults[token.key];
      }

      token = fn(token);
      push(token);

      keys.push(token.key);
      unique.add(token.key);

      let item = items.find(ch => ch.name === token.key);
      if (!item) {
        items.push(new Item(token));
      }
      continue;
    }

    let last = tokens[tokens.length - 1];
    if (last.type === 'text' && last.line === line) {
      last.value += value;
    } else {
      push({ type: 'text', value });
    }
  }

  push({ type: 'eos', value: '' });
  return { tokens, unique, keys, items };
};

module.exports = prompt => {
  let options = prompt.options;
  let defaults = { ...options.values, ...options.initial };
  let { tokens, items, keys } = tokenize(options, defaults);

  return async(state = {}, isLast = false) => {
    let index = 0;

    state.items = items;
    state.keys = keys;
    state.output = '';

    let format = (value, item) => {
      if (typeof options.format === 'function') {
        return options.format(value, item, state);
      }
      return value;
    };

    for (let token of tokens) {
      let value = token.value;
      let key = token.key;

      if (token.type !== 'template') {
        if (value) state.output += value;
        continue;
      }

      if (token.type === 'template') {
        let item = items.find(ch => ch.name === key);
        let val = [item.input, state.values[item.value], item.value, value].find(v => !!v);

        if (isLast) {
          let result = await format(state.values[key], item, state);
          state.output += colors.unstyle(result);
          continue;
        }

        if (val !== value) {
          state.values[key] = val;
          value = prompt.styles.muted(val);

        } else if (isLast) {
          value = '';

        } else {
          state.values[key] = '';
          val = `<${token.inner}>`;

          if (state.missing.has(key) || state.invalid.has(key)) {
            value = prompt.styles.danger(val);
          } else {
            value = prompt.styles.primary(val);
          }
        }

        if (index === state.index) {
          value = prompt.styles.primary.underline(value);
        }

        index++;
      }

      if (value) {
        state.output += value;
      }
    }
    return state.output;
  };
};
