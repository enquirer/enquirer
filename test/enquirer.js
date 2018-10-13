'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const Enquirer = require('..');
let enquirer;

describe('Enquirer', function() {
  describe('questions', () => {
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

  describe('onSubmit', () => {
    it('should call onSubmit when a prompt submitted', cb => {
      enquirer = new Enquirer({
        show: false,
        onSubmit(value) {
          assert.equal(value, 'orange');
          cb();
        }
      });

      enquirer.on('prompt', prompt => {
        prompt.value = 'orange';
        prompt.submit()
      });

      enquirer.prompt({
        type: 'input',
        name: 'color',
        message: 'Favorite color?'
      });
    });

    it('should await onSubmit when a prompt submitted', async cb => {
      let called = 0;

      enquirer = new Enquirer({
        show: false,
        onSubmit(value, state) {
          return new Promise(resolve => {
            setTimeout(() => {
              assert.equal(value, state.prompt.name === 'flavor' ? 'orange' : 'blue');
              called++;
              resolve();
            }, 10);
          });
        }
      });

      enquirer.on('prompt', prompt => {
        prompt.value = prompt.name === 'flavor' ? 'orange' : 'blue';
        prompt.submit();
      });

      let answers = await enquirer.prompt([
        {
          type: 'input',
          name: 'flavor',
          message: 'Favorite flavor?'
        },
        {
          type: 'input',
          name: 'color',
          message: 'Favorite color?'
        }
      ]);

      assert.equal(called, 2);
      cb();
    });
  });
});
