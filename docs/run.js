const fs = require('fs');
const vm = require('vm');
const path = require('path');
const colors = require('ansi-colors');
const tokenize = require('tokenize-comment');
const resolve = name => path.join(__dirname, name);
const { prompt } = require('..');

const wrap = str => {
  return `(function (exports, console, require, module, __filename, __dirname) { ${str}\n});`
};

function blocks(file) {
  let { choices, comment } = file;

  return new Promise(async(resolve, reject) => {
    let example;

    if (comment.examples.length > 1) {
      let answers = await prompt({
        name: 'example',
        type: 'select',
        message: 'Which example would you like to run?',
        choices,
        format() {
          return this.focused.message[0];
        },
        result(name) {
          return this.focused.name;
        }
      });

      example = comment.examples[Number(answers.example)];
    } else if (choices.length === 1) {
      example = comment.examples[0];
    } else {
      console.log('There are no examples to run in: ', file.path);
      resolve();
      return;
    }

    Promise.resolve(run(example.value))
      .then(() => resolve)
      .catch(reject);
  });
}

function run(str) {
  let fn = vm.runInNewContext(wrap(fixRequires(str)));
  return fn(exports, console, require, module, __filename, __dirname);
}

function toChoices(examples) {
  if (examples.length === 0) return [];

  let choices = [];
  for (let i = 0; i < examples.length; i++) {
    let example = examples[i];
    let prop = example.value ? 'value' : 'val';
    let n = `${i + 1}. `;

    if (!hasPrompt(example[prop])) {
      continue;
    }

    example[prop] = fixAsyncAwait(example[prop]);
    example[prop] = fixRequires(example[prop]);
    let choice = { name: String(i) };
    let desc = example.description;

    if (desc) {
      choice.message = n + stripMarkdown(desc);
    } else {
      choice.message = `Example #${i}`;
    }
    choices.push(choice);
  }
  return choices;
}

function hasPrompt(str) {
  return /(\.run\(\)|await prompt\()/.test(str);
}

function stripMarkdown(str) {
  return str.replace(/^\W+|\W+$/g, '');
}

function readFiles(dir) {
  let files = fs.readdirSync(dir, { withFileTypes: true });
  let choices = [];
  for (let obj of files) {
    if (obj.name === 'support' || obj.name === 'node_modules') continue;
    let choice = { name: obj.name, value: path.join(dir, obj.name) };
    if (obj.isDirectory()) {
      choice.role = 'heading';
      choice.name = colors.dim(choice.name + '/');
      let res = readFiles(choice.value);
      if (res.length) {
        choice.choices = res;
        choices.push(choice);
      }
    } else if (choice.name.endsWith('.md')) {
      let buf = fs.readFileSync(choice.value);
      let file = { ...obj };
      file.contents = buf;
      file.comment = tokenize(buf.toString(), { stripStars: false });
      file.comment.examples = file.comment.examples
        .filter(e => hasPrompt(e.value))
        .filter(e => /^(\*\*|<!--\s*Example)/.test(e.description))
        .map(e => {
          e.description = fixDescriptions(e.description);
          return e;
        });

      file.choices = toChoices(file.comment.examples);
      if (file.choices.length) {
        choice.file = file;
        // choice.choices = file.choices;
        choices.push(choice);
      }
    }
  }
  return choices;
}

function fixAsyncAwait(str) {
  if (!/await prompt/.test(str)) return str;
  return`(async() => {${str}})().catch(console.error)`;
}

function fixDescriptions(input = '') {
  let str = input.split('\n')[0].trim();
  return str.replace(/<!--\s*Example:?(.*?)-->/g, (m, $1) => $1.trim());
}

function fixRequires(str) {
  return str.replace(/require\('(.*?)'\)/g, (m, name) => {
    let idx = name.indexOf('./lib/');
    if (idx !== -1) {
      return `require('${resolve('..', name.slice(idx))}')`;
    }
    if (name === 'enquirer') {
      return `require('${resolve('..')}')`;
    }
    return m;
  });
}

prompt({
  name: 'filename',
  type: 'select',
  message: 'Which file do you want to run?',
  choices: [
    {
      role: 'heading',
      message: colors.dim('docs/'),
      choices: readFiles(__dirname)
    }
  ],
  result() {
    return this.focused.file;
  }
})
  .then(answers => blocks(answers.filename))
  .catch(console.error);
