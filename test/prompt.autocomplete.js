'use strict';

require('mocha');
const fs = require('fs');
const assert = require('assert');
const { timeout, keypresses } = require('./support')(assert);
const AutoComplete = require('../lib/prompts/autocomplete');
let prompt;

const fixtures = ['almond', 'apple', 'banana', 'cherry', 'chocolate', 'cinnamon', 'coconut', 'cotton candy', 'grape', 'nougat', 'orange', 'pear', 'pineapple', 'strawberry', 'vanilla', 'watermelon', 'wintergreen'];

class Prompt extends AutoComplete {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('prompt-autocomplete', () => {
  describe('keypress > number', () => {
    it.skip('should support number keypresses', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: [
          { message: 'a', value: 'A' },
          { message: 'b', value: 'BB' },
          { message: 'c', value: 'CCC' },
          { message: 'd', value: 'DDDD' }
        ]
      });

      prompt.once('run', async() => {
        await prompt.keypress(1);
        await prompt.keypress(3);
        await prompt.keypress(2);
        await prompt.submit();
      });

      return prompt.run().then(answer => {
        assert.equal(answer, 'CCC');
      });
    });

    it('should filter by keypress', function() {
      this.timeout(5000);

      prompt = new Prompt({
        message: 'Favorite letters?',
        choices: [
          { message: 'aab', value: 'A' },
          { message: 'aac', value: 'BB' },
          { message: 'abb', value: 'CCC' },
          { message: 'abc', value: 'DDDD' }
        ]
      });

      prompt.once('run', async() => {
        await timeout(async() => prompt.keypress('a'));
        await timeout(async() => prompt.keypress('b'), 2);
        await timeout(async() => prompt.keypress('c'), 2);
        await timeout(async() => prompt.submit(), 2);
      });

      return prompt.run().then(answer => {
        assert.equal(answer, 'DDDD');
      });
    });
  });

  describe('prompt.reset', () => {
    it('should reset to initial state', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixtures.slice(),
        suggest(typed, choices = []) {
          return choices.filter(choice => choice.message.includes(typed));
        }
      });

      prompt.once('run', async() => {
        await prompt.keypress('b');
        await prompt.keypress('e');
        await prompt.keypress('r');
        await prompt.keypress('r');
        await prompt.keypress('y');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'strawberry');
        });
    });
  });

  describe('options.choices', () => {
    it('should add an array of choice objects', cb => {
      prompt = new Prompt({
        message: 'Favorite letters?',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.has(prompt.choices, [
          { value: 'a', message: 'A', enabled: false },
          { value: 'b', message: 'BB', enabled: false },
          { value: 'c', message: 'CCC', enabled: false },
          { value: 'd', message: 'DDDD', enabled: false }
        ]);
        assert.equal(prompt.initial, 0);
        cb();
      });

      prompt.run().catch(cb);
    });

    it('should get choices by calling choices function', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices() {
          return [
            { name: 'apple', value: 'APPLE' },
            { name: 'banana', value: 'BANANA' },
            { name: 'cherry', value: 'CHERRY' },
            { name: 'chocolate', value: 'CHOCOLATE' },
            { name: 'cinnamon', value: 'CINNAMON' },
            { name: 'coconut', value: 'COCONUT' }
          ];
        }
      });

      prompt.once('run', async() => {
        await prompt.keypress('c');
        await prompt.keypress('h');
        await prompt.keypress('o');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'CHOCOLATE');
        });
    });
  });

  describe('options.initial', () => {
    it('should support options.initial as a string', () => {
      prompt = new Prompt({
        message: 'Favorite letters?',
        initial: 'b',
        choices: [
          { name: 'a', value: 'FOO', message: 'A' },
          { name: 'b', value: 'BAR', message: 'BB' },
          { name: 'c', value: 'BAZ', message: 'CCC' },
          { name: 'd', value: 'QUX', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'BAR');
        });
    });

    it('should support options.initial as a number', () => {
      prompt = new Prompt({
        message: 'Favorite letters?',
        initial: 2,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', async() => {
        assert.equal(prompt.initial, 2);
        assert.has(prompt.choices, [
          { name: 'a', message: 'A', enabled: false },
          { name: 'b', message: 'BB', enabled: false },
          { name: 'c', message: 'CCC', enabled: true },
          { name: 'd', message: 'DDDD', enabled: false }
        ]);
        await prompt.submit();

      });

      return prompt.run()
        .then(answer => assert.equal(answer, 'c'))
    });
  });

  describe('options.suggest', () => {
    it('should support a custom suggest function', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixtures.slice(),
        suggest(input, choices) {
          return choices.filter(choice => choice.message.includes(input));
        }
      });

      prompt.once('run', async() => {
        await prompt.keypress('b');
        await prompt.keypress('e');
        await prompt.keypress('r');
        await prompt.keypress('r');
        await prompt.keypress('y');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'strawberry');
        });
    });

    it('should filter this.choices', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixtures.slice(),
        suggest(typed, choices) {
          return choices.filter(choice => choice.message.includes(typed));
        }
      });

      prompt.once('run', async() => {
        await prompt.keypress('b');
        await prompt.keypress('e');
        await prompt.keypress('r');
        await prompt.keypress('r');
        await prompt.keypress('y');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'strawberry');
        });
    });

    it('should work when backspaces are typed', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixtures.slice(),
        suggest(typed, choices) {
          return choices.filter(choice => choice.message.includes(typed));
        }
      });

      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress('p');
        await prompt.keypress('p');
        await prompt.keypress('l');
        await prompt.keypress('e');
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress(null, { name: 'backspace' });
        await prompt.keypress('b');
        await prompt.keypress('e');
        await prompt.keypress('r');
        await prompt.keypress('r');
        await prompt.keypress('y');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'strawberry');
        });
    });

    it('should support a custom suggest function and use choices passed in', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixtures.slice(),
        suggest(typed, choices) {
          return choices.filter(choice => choice.message.includes(typed));
        },
      });

      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress('p');
        await prompt.keypress('p');
        await prompt.keypress('l');
        await prompt.keypress('e');
        await prompt.delete();
        await prompt.delete();
        await prompt.delete();
        await prompt.delete();
        await prompt.delete();
        await prompt.keypress('b');
        await prompt.keypress('e');
        await prompt.keypress('r');
        await prompt.keypress('r');
        await prompt.keypress('y');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'strawberry');
        });
    });

    it('should support a custom suggest function with a choices function', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices() {
          return ['almond', 'apple', 'banana', 'cherry', 'chocolate'];
        },
        suggest(input, choices) {
          return choices.filter(choice => choice.message.includes(input));
        }
      });

      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress('p');
        await prompt.keypress('p');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'apple');
        });
    });

    it('should dynamically add choices', function() {
      this.timeout(5000);
      let pending = fixtures.slice();

      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices(typed, choices) {
          return new Promise(async(resolve) => {
            setTimeout(() => resolve([]), 3);
          });
        },
        async suggest(input, choices = []) {
          return new Promise(async(resolve) => {
            if (!input) {
              resolve(choices);
              return;
            }

            let list = pending.filter(str => str.startsWith(input));
            let items = await Promise.all(await this.toChoices(list));
            for (let item of items) {
              if (!this.find(item.name)) {
                this.choices.push(item);
              }
            }
            setTimeout(() => resolve(items), 1);
          });
        }
      });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('a'), 1);
        await timeout(() => prompt.delete(), 1);
        await timeout(() => prompt.keypress('b'), 1);
        await timeout(() => prompt.delete(), 1);
        await timeout(() => prompt.keypress('c'), 1);
        await timeout(() => prompt.keypress('h'), 1);
        await timeout(() => prompt.keypress('o'), 1);
        await timeout(() => prompt.submit(), 1);
      });

      return prompt.run()
        .then(async answer => {
          assert.deepEqual(prompt.state._choices.map(ch => ch.name), ['almond', 'apple', 'banana', 'cherry', 'chocolate', 'cinnamon', 'coconut', 'cotton candy']);
          assert.deepEqual(prompt.choices.map(ch => ch.name), ['chocolate']);
          assert.equal(answer, 'chocolate');
        });
    });

    it('should support default suggest function with choices as a function', () => {
      prompt = new Prompt({
        message: 'Choose a file',
        choices() {
          return fs.readdirSync(__dirname);
        }
      });

      prompt.once('run', async() => {
        await keypresses(prompt, prompt.choices[0].message);
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, prompt.choices[0].message);
        });
    });

    it('should support async options.suggest function', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixtures.slice(),
        suggest(typed, choices) {
          const search = async() => choices.filter(choice => choice.message.includes(typed));
          return timeout(search, 5);
        }
      });

      prompt.once('run', async() => {
        await prompt.keypress('a');
        await prompt.keypress('p');
        await prompt.keypress('p');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'apple');
        });
    });
  });

  describe('dispatch', () => {
    it('should dispatch alpha-numeric chars', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixtures.slice(),
        suggest(input, choices) {
          return choices.filter(choice => choice.message.includes(input));
        }
      });

      prompt.once('run', async() => {
        await prompt.dispatch('b');
        await prompt.dispatch('e');
        await prompt.dispatch('r');
        await prompt.dispatch('r');
        await prompt.dispatch('y');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'strawberry');
        });
    });

    it('should delete characters from state.input', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixtures.slice(),
        suggest(typed, choices) {
          return choices.filter(choice => choice.message.includes(typed));
        }
      });

      prompt.once('run', async() => {
        await prompt.dispatch('a');
        await prompt.dispatch('p');
        await prompt.dispatch('p');
        await prompt.dispatch('l');
        await prompt.dispatch('e');
        await prompt.delete();
        await prompt.delete();
        await prompt.delete();
        await prompt.delete();
        await prompt.delete();
        await prompt.dispatch('b');
        await prompt.dispatch('e');
        await prompt.dispatch('r');
        await prompt.dispatch('r');
        await prompt.dispatch('y');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'strawberry');
        });
    });

    it('should emit "alert" when delete is pressed with no input', () => {
      let called = 0;

      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixtures.slice(),
        suggest(typed, choices) {
          return choices.filter(choice => choice.message.includes(typed));
        }
      });

      prompt.on('alert', () => (called++));

      prompt.once('run', async() => {
        await prompt.delete();
        await prompt.dispatch('a');
        await prompt.delete();
        await prompt.dispatch('a');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(called, 1);
          assert.equal(answer, 'almond');
        });
    });
  });

  describe('choice.value', () => {
    it('should return the choice.value', async() => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: [
          { name: 'apple', value: 'APPLE' },
          { name: 'banana', value: 'BANANA' },
          { name: 'cherry', value: 'CHERRY' },
          { name: 'chocolate', value: 'CHOCOLATE' },
          { name: 'cinnamon', value: 'CINNAMON' },
          { name: 'coconut', value: 'COCONUT' }
        ]
      });

      prompt.once('run', async() => {
        await prompt.keypress('c');
        await prompt.keypress('h');
        await prompt.keypress('o');
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'CHOCOLATE');
        });
    });
  });
});
