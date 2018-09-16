'use strict';

const colors = require('ansi-colors');
const ansi = require('./style/ansi');
const symbols = require('./style/symbols');
const keypress = require('./keypress');
const actions = require('./action');
const first = arr => arr.find(v => v != null);

const tokenize = (input, defaults = {}, fn = token => token) => {
  let unique = new Set();
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

      push(fn(token));

      keys.push(token.key);
      unique.add(token.key);
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
  return { tokens, unique, keys };
};

const required = (keys = [], req = []) => {
  let arr = req === true ? [...keys] : [].concat(req);
  return key => arr.includes(key);
};

const validator = (options = {}) => {
  return options.validate || ((key, value, state) => {

  });
};

const formatter = (options = {}) => {
  return options.format || ((key, value, state) => {

  });
};

const compile = (input, options = {}) => {
  let defaults = { ...options.values };
  let { tokens, keys, unique } = tokenize(input, defaults);

  let req = options.required || [];
  let required = options.required === true ? [...unique] : [].concat(req);

  return (state = {}) => {
    let { values, submitted = false } = state;
    let index = 0;

    state.keys = keys;
    state.required = required;
    state.errors = [];
    state.output = '';

    for (let token of tokens) {
      let value = first([values[token.key], token.default, token.value, '']);
      let val = state.typed || value;
      let raw = value;

      if (token.type === 'template') {
        if (value === token.value && submitted && required.has(token.key)) {
          value = colors.red(raw);
        } else if (raw !== token.value && raw !== defaults[token.key]) {
          value = colors.dim(raw);
        } else {
          value = colors.cyan(raw);
        }

        if (index === state.index) {
          if (val !== token.value) {
            state.values[token.key] = val;
          }
          value = colors.underline(val);
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
console.time('compile time');

const prompt = options => {
  let opts = { ...options };

  let fn = compile(opts.template, {
    defaults: { name: 'awesome-lib', license: 'MIT' },
    required: true
  });

  console.timeEnd('compile time');
  let stdout = opts.stdout || process.stdout;
  let width = stdout.colums || 80;

  let terminal = '';
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
    index: 0,
    errors: [],
    missing: new Set(),
    cursor: 0,
    output: ''
  };

  let clear = () => {
    stdout.write(ansi.clear(terminal, width));
    terminal = '';
  };

  let write = (output = '') => {
    stdout.write(output);
    terminal += output;
  };

  let update = () => {
    if (state.key && state.typed) {
      state.values[state.key] = state.typed;
      state.missing.delete(state.key);
      return;
    }
    if (state.key && state.required.has(state.key)) {
      state.missing.add(state.key);
    }
  };

  let render = () => {
    fn(state);
    clear();
    write([state.prefix, state.message, state.separator, state.typed].join(' ') + '\n');
    write(state.output);
  };

  let alert = () => write(ansi.bell);

  render();

  return new Promise((resolve, reject) => {
    const stopListening = keypress.listen(process.stdin, (ch, key) => {
      let { action } = actions(key);
      let k, prefix, suffix;

      const right = () => {
        if (state.cursor >= state.typed.length) {
          return alert();
        }
        state.cursor++;
        render();
      };

      const left = (show = true) => {
        if (state.cursor <= 0) {
          return alert();
        }
        state.cursor--;
        show && render()
      };

      const backspace = () => {
        let typed = colors.unstyle(state.typed);
        prefix = typed.slice(0, state.cursor - 1);
        suffix = typed.slice(state.cursor);
        state.typed = `${prefix}${suffix}`;
        left(false);
        update();
        render();
      };

      switch (action) {
        case 'cancel':
        case 'submit':
          stopListening();
          action === 'cancel' ? reject() : resolve(state);
          break;
        case 'left':
          left();
          break;
        case 'right':
          rignt();
          break;
        case 'tab':
        case 'down':
        case 'next':
          state.index++;
          if (state.index > state.keys.length) state.index = 0;
          state.typed = '';
          // state.key = state.keys[state.index];
          // state.typed = state.values[state.key] || '';
          // state.cursor = state.typed.length;
          render();
          break;
        case 'up':
        case 'prev':
        case 'shiftTab':
          state.index--;
          if (state.index < 0) state.index = state.keys.length;
          state.typed = '';

          // state.key = state.keys[state.index];
          // state.typed = state.values[state.key] || '';
          // state.cursor = state.typed.length;
          render();
          break;
        case 'delete':
          backspace();
          break;
        default: {
          if (key.code || !ch) {
            alert();
            break;
          }
          prefix = state.typed.slice(0, state.cursor);
          suffix = state.typed.slice(state.cursor);
          state.typed = `${prefix}${ch}${suffix}`;
          right();
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

prompt({ message: 'Please fill in missing fields', template })
  .then(answer => console.log('ANSWER:', answer))
  .catch(console.error);
