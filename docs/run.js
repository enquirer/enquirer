const fs = require('fs');
const vm = require('vm');
const path = require('path');
const tokenize = require('tokenize-comment');
const filepath = name => path.join(__dirname, name);
const { prompt } = require('..');

function blocks(filepath) {
  let str = fs.readFileSync(filepath);
  return new Promise(async(resolve, reject) => {
    let comment = tokenize(str.toString(), { stripStars: false });
    let choices = toChoices(comment.examples);
    let example;

    if (choices.length > 1) {
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
    } else if (comment.examples.length === 0) {
      console.log('There are no examples to run in: ', filepath);
      return;
    } else {
      example = comment.examples[0];
    }

    const wrap = str => {
      return `(function (exports, console, require, module, __filename, __dirname) { ${str}\n});`
    };
    let fn = vm.runInNewContext(wrap(example.value));
    Promise.resolve(fn(exports, console, require, module, __filename, __dirname))
      .then(() => resolve)
      .catch(reject);

  });
}

function toChoices(examples) {
  let choices = [];
  for (let i = 0; i < examples.length; i++) {
    let example = examples[i];
    let n = `${i + 1}. `;
    example.value = example.value.replace(/require\('enquirer'\)/g, `require('..')`);
    let desc = example.description;
    if (desc) {
      choices.push({ name: String(i), message: n + stripMarkdown(desc) });
    } else {
      choices.push({ name: String(i), message: 'Example #' + i });
    }
  }
  return choices;
}

function stripMarkdown(str) {
  return str.replace(/^\W+|\W+$/g, '');
}

function readFiles(dir) {
  let files = fs.readdirSync(dir, { withFileTypes: true });
  let choices = [];

  for (let file of files) {
    if (file.name === 'support') continue;
    let choice = { name: file.name, value: path.join(dir, file.name) };
    if (file.isDirectory()) {
      choice.role = 'heading';
      choice.choices = readFiles(choice.value);
    } else if (!choice.name.endsWith('.md')) {
      continue;
    }
    choices.push(choice);
  }
  return choices;
}

prompt({
  name: 'file',
  type: 'select',
  message: 'Which file do you want to run?',
  choices: readFiles(__dirname),
  heading(str) {
    return this.styles.dim(str + '/');
  },
  result() {
    return this.focused.value;
  }
})
  .then(answers => blocks(answers.file))
  .catch(console.error);
