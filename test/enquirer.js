'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const Enquirer = require('..');
let enquirer;

describe('Enquirer', function() {
  describe('question objects', () => {
    it('should run a single question object', cb => {
      enquirer = new Enquirer();
      enquirer.on('prompt', prompt => prompt.submit());

      enquirer.prompt({
        type: 'toggle',
        name: 'pick',
        message: 'Take your pick',
        show: false
      })
      .then(answers => {
        assert.equal(answers.pick, false);
        cb();
      });
    });
  });

  describe('question arrays', () => {
    it('should run an array of questions', (cb) => {
      enquirer = new Enquirer();
      enquirer.on('prompt', prompt => {
        if (prompt.type === 'toggle') {
          prompt.space();
        } else {
          prompt.value = 'Brian';
        }
        prompt.submit();
      });

      enquirer.prompt([{
        type: 'toggle',
        name: 'foo',
        message: 'Take your pick',
        show: false
      },
      {
        type: 'input',
        name: 'bar',
        message: 'What is your name?',
        show: false
      }])
      .then(answers => {
        assert.equal(answers.foo, true);
        assert.equal(answers.bar, 'Brian');
        cb();
      });
    });
  });
});
