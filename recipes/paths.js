'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const colors = require('ansi-colors');
const Prompt = require('../prompts/autocomplete');
const readdir = util.promisify(fs.readdir);
const { symbols } = Prompt.utils;

/**
 * PathsPrompt prompt.
 * @param {Object} options Options
 * @param {String} options.message Message
 * @param {Array} options.choices Array of choice objects
 * @param {String} [options.hint] Hint to display
 * @param {Number} [options.cursor=0] Cursor start position
 * @param {Number} [options.max] Max choices
 */

class PathsPrompt extends Prompt {
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

function isDirectory(fp) {
  return fs.existsSync(fp) && fs.statSync(fp).isDirectory();
}

// function getPaths(cwd, pattern = '', filter) {
//   function nodeOption(fp, isDirectory) {
//     return filter(isDirectory, fp) ? [fp] : [];
//   }

//   async function walk(fp) {
//     try {
//       const nodes = await readdir(fp);
//       const currentNode = nodeOption(fp, true);
//       if (nodes.length > 0) {
//         const nodex = nodes.map(dirName => walk(path.join(fp, dirName)));
//         const subNodes = await Promise.all(nodex);
//         return subNodes.reduce((acc, val) => acc.concat(val), currentNode);
//       }
//       return currentNode;
//     } catch (err) {
//       if (err.code === 'ENOTDIR') {
//         return nodeOption(fp, false);
//       }
//       throw err;
//     }
//   }

//   const nodes = walk(cwd);
//   return nodes.then(list => fuzzy.filter(pattern || '', list).map(e => e.path));
// }

// async function expand(cwd, choice, prompt) {
//   const indent = choice.indent + '  ';
//   const files = await readdir(cwd);
//   const choices = [];
//   let idx = choice.index;
//   for (const name of files) {
//     const child = { name, path: path.join(choice.path, name), indent };
//     if (isDirectory(child.path)) {
//       child.expanded = false;
//     }
//     // if (prompt.options.filter && prompt.options.filter(child) == false) continue;
//     choices.push(prompt.toChoice(child, ++idx));
//   }
//   return choices;
// }

module.exports = PathsPrompt;

const prompt = new PathsPrompt({
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

