'use strict';

const colors = require('ansi-colors');
const ansi = require('./style/ansi');
const symbols = require('./style/symbols');
const keypress = require('./keypress');
const actions = require('./action');
const utils = require('./utils');

class Choice {
  constructor(token) {
    this.name = token.key;
    this.value = this.default = token.default || '';
    this.cursor = 0;
    this.typed = '';
  }
  isValid(options = {}) {
    if (typeof options.isValid === 'function') {
      return options.isValid.call(this, this.name, this.value);
    }
    return true;
  }
  format(options = {}) {
    if (typeof options.format === 'function') {
      return options.format.call(this, this.value);
    }
    return this.value;
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

    if (value === '$' && peek() === '{') {
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

const compile = (input, options = {}) => {
  let defaults = { ...options.values };
  let { tokens, choices, keys } = tokenize(input, defaults);

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
        let val = utils.first([choice.typed, choice.value, value]);

        if (state.answered) {
          let result = format(state.values[key], choice, state);
          state.output += colors.unstyle(result);
          continue;
        }

        if (val !== value) {
          state.values[key] = val;
          value = colors.dim(val);
        } else {
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
    return state;
  };
};

// const render = compile(template, {
//   defaults: { name: 'awesome-lib', license: 'MIT' },
//   required: true
// });

// const result = render({
//   cursor: 4,
//   typed: '',
//   submitted: false,
//   values: {}
// });

const prompt = options => {
  let opts = { ...options };
  let interpolate = compile(opts.template, opts);

  let stdout = opts.stdout || process.stdout;
  let width = stdout.colums || 80;

  let state = {
    prefix: opts.prefix || colors.cyan(symbols.questionSmall),
    separator: opts.separator || colors.dim(symbols.ellipsis),
    message: opts.message || opts.name,
    original: { ...options.values },
    values: { ...options.values },
    submitted: false,
    cancelled: false,
    answered: false,
    typed: '',
    terminal: '',
    index: 0,
    errors: [],
    missing: new Set(['license', 'version']),
    invalid: new Set(),
    cursor: 0,
    output: ''
  };

  let clear = () => {
    stdout.write(ansi.clear(state.terminal, width));
    state.terminal = '';
  };

  let write = (output = '') => {
    state.terminal += output;
    stdout.write(output);
  };

  let update = () => {
    if (state.key && state.typed) {
      state.missing.delete(state.key);
      return;
    }
    if (state.key && state.required.has(state.key)) {
      state.missing.add(state.key);
    }
  };

  let render = () => {
    clear();
    interpolate(state);
    write([state.prefix, state.message, state.separator, state.typed].join(' ') + '\n');
    write(state.output);
  };

  let alert = () => write(ansi.bell);
  let increment = i => (i >= state.keys.length - 1 ? 0 : (i + 1));
  let decrement = i => (i <= 0 ? state.keys.length - 1 : (i - 1));
  let getChoice = name => {
    return state.choices.find(ch => ch.name === state.keys[state.index]);
  };

  write(ansi.cursor.show);
  render();

  return new Promise((resolve, reject) => {
    const stopListening = keypress.listen(process.stdin, (ch, key) => {
      let { action } = actions(key);
      let choice = getChoice();
      let prefix, suffix;

      // console.log([ch, key])

      // if (action === 'cancel' || action === 'submit') {
      //   stopListening();
      //   return;
      // }

      let moveCursor = n => {
        choice.cursor += n;
        state.cursor += n;
      };

      if (choice && choice.typed) {
        state.typed = choice.typed;
        state.cursor = choice.cursor;
      }

      switch (action) {
        case 'cancel':
          stopListening();
          state.submitted = state.cancelled = true;
          render();
          reject();
          break;
        case 'submit':
          stopListening();
          state.submitted = state.answered = true;
          render();
          resolve({ output: state.output, values: state.values });
          break;
        case 'left':
          if (state.cursor <= 0) {
            return alert();
          }
          moveCursor(-1);
          render();
          break;
        case 'right':
          if (state.cursor >= state.typed.length) {
            return alert();
          }
          moveCursor(1);
          render();
          break;
        case 'up':
        case 'prev':
        case 'shiftTab':
          state.index = decrement(state.index);
          render();
          break;
        case 'tab':
        case 'down':
        case 'next':
          state.index = increment(state.index);
          render();
          break;
        case 'first':
          state.index = 0;
          render();
          break;
        case 'last':
          state.index = state.keys.length;
          render();
          break;
        case 'delete':
          if (state.cursor <= 0 || !choice.typed) {
            alert();
            break;
          }

          suffix = choice.typed.slice(state.cursor);
          prefix = choice.typed.slice(0, state.cursor - 1);
          state.typed = choice.typed = `${prefix}${suffix}`;
          moveCursor(-1);
          render();
          break;
        default: {
          if (key.code || key.ctrl || !ch || !choice) {
            alert();
            break;
          }
          prefix = choice.typed.slice(0, state.cursor);
          suffix = choice.typed.slice(state.cursor);
          state.typed = choice.typed = `${prefix}${ch}${suffix}`;
          update();
          moveCursor(1);
          render();
          break;
        }
      }
    });
  });
};

const template = `{
  "name": "\${name}",
  "description": "\${description:This is a great project}",
  "version": "\${version}",
  "homepage": "https://github.com/\${username}/\${name}",
  "author": "\${author_name} (https://github.com/\${username})",
  "repository": "\${username}/\${name}",
  "bugs": {
    "url": "https://github.com/\${username}/\${name}/issues"
  },
  "engines": {
    "node": ">=4"
  },
  "license": "\${license:MIT}",
  "scripts": {
    "test": "mocha"
  },
  "keywords": []
}
`;

let format = (value, choice, state) => value || '';

prompt({ message: 'Please fill in missing fields', template, format })
  .then(answer => console.log('ANSWER:', answer.values))
  .catch(console.error);
