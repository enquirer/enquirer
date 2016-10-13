'use strict';

var Separator = require('choices-separator');
var Enquirer = require('..');
var enquirer = new Enquirer();

enquirer.register('expand', require('prompt-expand'));

var questions = [
  {
    type: 'expand',
    message: 'Conflict on `file.js`: ',
    default: 'x',
    name: 'file',
    choices: [
      {
        key: 'y',
        name: 'Overwrite',
        value: 'overwrite'
      },
      {
        key: 'a',
        name: 'Overwrite this one and all next',
        value: 'overwrite_all'
      },
      {
        key: 'd',
        name: 'Show diff',
        value: 'diff'
      },
      new Separator(),
      {
        key: 'x',
        name: 'Abort',
        value: 'abort'
      }
    ]
  }
];

enquirer.ask(questions)
  .then(function (answers) {
    console.log(answers);
  })
  .catch(function (err) {
    console.log(err);
  });
