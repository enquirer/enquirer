'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const Enquirer = require('..');
let enquirer;

describe('Enquirer', function() {
  describe('question objects', () => {
    it('should run a single question object', cb => {
      enquirer = new Enquirer({ show: false });
      enquirer.on('prompt', prompt => {
        prompt.value = 'orange';
        prompt.submit()
      });

      enquirer.prompt({
        type: 'input',
        name: 'color',
        message: 'Favorite color?'
      })
      .then(answers => {
        assert.equal(answers.color, 'orange');
        cb();
      });
    });
  });

  describe('question arrays', () => {
    it('should run an array of questions', (cb) => {
      enquirer = new Enquirer({ show: false });
      enquirer.on('prompt', prompt => {
        if (prompt.name === 'color') {
          prompt.value = 'blue';
        } else {
          prompt.value = 'Brian';
        }
        prompt.submit();
      });

      enquirer.prompt([{
        type: 'input',
        name: 'color',
        message: 'Favorite color?'
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?'
      }])
      .then(answers => {
        assert.equal(answers.color, 'blue');
        assert.equal(answers.name, 'Brian');
        cb();
      });
    });
  });
});
