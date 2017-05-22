'use strict';

var Enquirer = require('../../../..');

module.exports = function(name, question, options, cb) {
  var args = [].slice.call(arguments);
  var app = this.app;

  var val = app.store.get(name);
  if (val && !app.options.prompt) {
    cb(null, val);
    return;
  }

  var enquirer = new Enquirer();
  enquirer.register('confirm', require('prompt-confirm'));
  cb = args.pop();

  if (typeof question === 'string') {
    question = { message: question };
  }

  enquirer.question(name, Object.assign({default: val}, question, options.hash));
  enquirer.question('save', {
    type: 'confirm',
    message: 'Want to store the answer to skip this prompt next time?',
    transform: function(answer) {
      if (answer === true) {
        app.store.set(name, this.answers[name]);
        console.log('√ saved on "' + name + '" in "' + app.store.relative + '"');
      } else {
        console.log(' got it, skipping');
      }
      return answer;
    },
    when: function(answers) {
      return answers[name].trim() !== '';
    }
  });

  enquirer.prompt(name)
    .then(function() {
      return enquirer.prompt('save');
    })
    .then(function(answers) {
      cb(null, answers[name]);
    })
    .catch(cb);
};
