'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const colors = require('ansi-colors');
const Prompt = require('../prompts/multiselect');
const readdir = util.promisify(fs.readdir);
const { symbols } = Prompt.utils;

/**
 * FilesPrompt prompt.
 * @param {Object} options Options
 * @param {String} options.message Message
 * @param {Array} options.choices Array of choice objects
 * @param {String} [options.hint] Hint to display
 * @param {Number} [options.cursor=0] Cursor start position
 * @param {Number} [options.max] Max choices
 */

class FilesPrompt extends Prompt {
  constructor(options = {}) {
    super({ ...options, expandable: true });
    this.choices[0].expanded = false;
  }

  toList() {
    const list = this.choices.filter(choice => !choice.collapsed);
    const max = this.options.limit || this.choices.length;
    this.limit = Math.max(Math.min(max, list.length, 10), 1);
    this.list = list.slice(0, this.limit);
    this.cursor = Math.min(this.cursor, this.limit - 1);
  }

  async space() {
    let choice = this.list[this.cursor];
    if (choice.choices) {
      const expanded = choice.enabled = (choice.expanded = !choice.expanded);
      const collapse = choice => {
        choice.collapsed = !expanded;
        if (choice.choices) {
          choice.choices.forEach(collapse);
        }
      };
      choice.choices.forEach(collapse);
    } else if (choice.path && isDirectory(choice.path)) {
      choice.expanded = choice.enabled = true;
      choice.choices = await expand(choice.path, choice, this);
    } else {
      choice.enabled = !choice.enabled;
    }

    this.toChoices();
    this.render();
  }

  // submit() {
  //   const submit = this.constructor.base.prototype.submit;
  //   this.value = this.choices.filter(choice => choice.enabled);
  //   submit.call(this);
  // }
}

function isDirectory(filepath) {
  return fs.existsSync(filepath) && fs.statSync(filepath).isDirectory();
}

async function expand(cwd, choice, prompt) {
  const indent = choice.indent + '  ';
  const files = await readdir(cwd);
  const choices = [];
  let idx = choice.index;
  for (const name of files) {
    const child = { name, path: path.join(choice.path, name), indent };
    if (isDirectory(child.path)) {
      child.expanded = false;
    }
    // if (prompt.options.filter && prompt.options.filter(child) == false) continue;
    choices.push(prompt.toChoice(child, ++idx));
  }
  return choices;
}

module.exports = FilesPrompt;

const prompt = new FilesPrompt({
  name: 'files',
  message: 'Pick some files',
  limit: 10,
  // filter(file) {
  //   return /\.js$/.file.path;
  // },
  choices: [
    {
      name: 'lib',
      path: path.join(process.cwd(), 'lib')
    }
  ]
});

// console.log(prompt.choices)

// prompt.once('run', () => console.log(prompt.choices))

prompt.run()
  .then(answer => console.log(answer))
  .catch(console.error)

