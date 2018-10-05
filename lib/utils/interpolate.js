'use strict';

const colors = require('ansi-colors');

class Choice {
  constructor(token) {
    this.name = token.key;
    this.value = token.default || '';
    this.message = token.message || this.name;
    this.cursor = 0;
    this.input = '';
  }
}

const tokenize = (input, defaults = {}, fn = token => token) => {
  let unique = new Set();
  let choices = [];
  let tokens = [];
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

      let choice = choices.find(ch => ch.name === token.key);
      if (!choice) {
        choices.push(new Choice(token));
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
  return { tokens, unique, keys, choices };
};

module.exports = (options = {}) => {
  let defaults = { ...options.values };
  let { tokens, choices, keys } = tokenize(options.template, defaults);

  return (state = {}) => {
    let index = 0;

    state.choices = choices;
    state.keys = keys;
    state.output = '';

    let format = (value, choice) => {
      if (typeof options.format === 'function') {
        return options.format(value, choice, state);
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
        let choice = choices.find(ch => ch.name === key);
        let val = [choice.input, state.values[choice.value], choice.value, value].find(v => !!v);

        if (state.answered) {
          let result = format(state.values[key], choice, state);
          state.output += colors.unstyle(result);
          continue;
        }

        if (val !== value) {
          state.values[key] = val;
          value = colors.dim(val);

        } else {
          state.values[key] = '';
          val = `<${token.inner}>`;

          if (state.missing.has(key) || state.invalid.has(key)) {
            value = colors.red(val);
          } else {
            value = colors.cyan(val);
          }
        }

        if (index === state.index) {
          value = colors.underline(value);
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
