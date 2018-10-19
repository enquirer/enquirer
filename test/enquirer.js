'use strict';

require('mocha');
const assert = require('assert');
const colors = require('ansi-colors');
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

    it('should run an array of questions', cb => {
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

  describe('options', () => {
    it('should pass enquirer options to prompts', () => {
      enquirer = new Enquirer({
        show: false,
        styles: {
          primary: colors.blue
        }
      });

      enquirer.on('prompt', async prompt => {
        try {
          prompt.state.input = 'orange';
          prompt.submit();
          assert.equal(prompt.styles.primary('orange'), colors.blue('orange'));
          assert.equal(prompt.format(), colors.blue('orange'));
          await prompt.render();
        } catch (err) {
          await prompt.cancel(err);
        }
      });

      return enquirer.prompt({
        type: 'input',
        name: 'color',
        message: 'Favorite color?'
      })
      .then(answers => {
        assert.equal(answers.color, 'orange');
      });
    });

  });

  describe('onSubmit', () => {
    it('should call onSubmit when a prompt submitted', cb => {
      enquirer = new Enquirer({
        show: false,
        onSubmit(name, value) {
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

    it('should await onSubmit when a prompt submitted', async () => {
      let called = 0;

      enquirer = new Enquirer({
        show: false,
        onSubmit(name, value, state) {
          return new Promise(resolve => {
            setTimeout(() => {
              assert.equal(value, name === 'flavor' ? 'orange' : 'blue');
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
    });
  });
});
