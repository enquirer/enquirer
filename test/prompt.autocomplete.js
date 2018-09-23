'use strict';

require('mocha');
const fs = require('fs');
const assert = require('assert');
const { timeout, press } = require('./support')(assert);
const { AutoComplete } = require('../lib/prompts');
let prompt;

const fixture = ['almond', 'apple', 'banana', 'cherry', 'chocolate', 'cinnamon', 'coconut', 'cotton candy', 'grape', 'nougat', 'orange', 'pear', 'pineapple', 'strawberry', 'vanilla', 'watermelon', 'wintergreen'];

class Prompt extends AutoComplete {
  constructor(options = {}) {
    super({ ...options });
  }
}

describe('prompt-autocomplete', () => {
  describe('keypress > number', () => {
    it('should support number keypresses', () => {
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
        await timeout(() => prompt.keypress(1));
        await timeout(() => prompt.keypress(3));
        await timeout(() => prompt.keypress(2));
        await timeout(() => prompt.submit());
      });

      return prompt.run().then(answer => {
        assert.equal(answer, 'CCC');
      });
    });

    it.only('should filter by keypress', function() {
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
        await timeout(() => prompt.keypress('a'), 1000);
        await timeout(() => prompt.keypress('b'), 1000);
        await timeout(() => prompt.keypress('c'), 1000);
        await timeout(() => prompt.submit(), 1000);
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
        choices: fixture.slice(),
        suggest(typed) {
          return this.choices.filter(choice => choice.message.includes(typed));
        },
      });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('b'));
        await timeout(() => prompt.keypress('e'));
        await timeout(() => prompt.keypress('r'));
        await timeout(() => prompt.keypress('r'));
        await timeout(() => prompt.keypress('y'));
        await timeout(() => prompt.submit());
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
        assert.equal(prompt.initial, void 0);
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
        await timeout(() => prompt.keypress('c'));
        await timeout(() => prompt.keypress('h'));
        await timeout(() => prompt.keypress('o'));
        await timeout(() => prompt.submit());
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

    it('should support options.initial as a number', cb => {
      prompt = new Prompt({
        message: 'Favorite letters?',
        initial: 2,
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
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
        cb();
      });

      prompt.run()
        .then(answer => assert.equal(answer, 'c'))
        .catch(cb);
    });
  });

  describe('options.suggest', () => {
    it('should support a custom suggest function', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixture.slice(),
        suggest(typed, choices) {
          return choices.filter(choice => choice.message.includes(typed));
        }
      });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('b'));
        await timeout(() => prompt.keypress('e'));
        await timeout(() => prompt.keypress('r'));
        await timeout(() => prompt.keypress('r'));
        await timeout(() => prompt.keypress('y'));
        await timeout(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'strawberry');
        });
    });

    it('should filter this.choices', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixture.slice(),
        suggest(typed) {
          return this.choices.filter(choice => choice.message.includes(typed));
        }
      });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('b'));
        await timeout(() => prompt.keypress('e'));
        await timeout(() => prompt.keypress('r'));
        await timeout(() => prompt.keypress('r'));
        await timeout(() => prompt.keypress('y'));
        await timeout(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'strawberry');
        });
    });

    it('should support a custom suggest function that works when backspaces are typed', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixture.slice(),
        suggest(typed) {
          return this.choices.filter(choice => choice.message.includes(typed));
        }
      });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('a'));
        await timeout(() => prompt.keypress('p'));
        await timeout(() => prompt.keypress('p'));
        await timeout(() => prompt.keypress('l'));
        await timeout(() => prompt.keypress('e'));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress('b'));
        await timeout(() => prompt.keypress('e'));
        await timeout(() => prompt.keypress('r'));
        await timeout(() => prompt.keypress('r'));
        await timeout(() => prompt.keypress('y'));
        await timeout(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'strawberry');
        });
    });

    it('should support a custom suggest function and use choices passed in', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixture.slice(),
        suggest(typed, choices) {
          return choices.filter(choice => choice.message.includes(typed));
        },
      });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('a'));
        await timeout(() => prompt.keypress('p'));
        await timeout(() => prompt.keypress('p'));
        await timeout(() => prompt.keypress('l'));
        await timeout(() => prompt.keypress('e'));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress('b'));
        await timeout(() => prompt.keypress('e'));
        await timeout(() => prompt.keypress('r'));
        await timeout(() => prompt.keypress('r'));
        await timeout(() => prompt.keypress('y'));
        await timeout(() => prompt.submit());
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
        suggest(typed, choices) {
          return choices.filter(choice => choice.message.includes(typed));
        }
      });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('a'));
        await timeout(() => prompt.keypress('p'));
        await timeout(() => prompt.keypress('p'));
        await timeout(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'apple');
        });
    });

    it('should dynamically add choices', function() {
      this.timeout(5000);
      let pending = fixture.slice();

      prompt = new Prompt({
        message: 'Favorite flavor?',
        async choices(typed) {
          let list = typed ? pending.filter(ele => ele.indexOf(typed) === 0) : [];
          if (!list.length) return this.choices;
          pending = pending.filter(ele => !list.includes(ele));
          let choices = list.length ? this.choices.concat(list) : this.choices;
          // simulate a delay
          return timeout(() => Promise.resolve(choices), 10);
        },
        suggest(typed, choices = []) {
          return choices.filter(choice => choice.message.includes(typed));
        }
      });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('a'));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress('b'));
        await timeout(() => prompt.keypress(null, { name: 'backspace' }));
        await timeout(() => prompt.keypress('c'));
        await timeout(() => prompt.keypress('h'));
        await timeout(() => prompt.keypress('o'));
        await prompt.submit();
      });

      return prompt.run()
        .then(answer => {
          assert.deepEqual(prompt.choices.map(ch => ch.name), ['almond', 'apple', 'banana', 'cherry', 'chocolate', 'cinnamon', 'coconut', 'cotton candy']);
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
        await press(prompt, prompt.choices[0].message);
        await timeout(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, prompt.choices[0].message);
        });
    });

    it('should support async options.suggest function', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        choices: fixture.slice(),
        suggest(typed, choices) {
          const search = async() => choices.filter(choice => choice.message.includes(typed));
          return timeout(search, 20);
        }
      });

      prompt.once('run', async() => {
        await timeout(() => prompt.keypress('a'));
        await timeout(() => prompt.keypress('p'));
        await timeout(() => prompt.keypress('p'));
        await timeout(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'apple');
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
        await timeout(() => prompt.keypress('c'));
        await timeout(() => prompt.keypress('h'));
        await timeout(() => prompt.keypress('o'));
        await timeout(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'CHOCOLATE');
        });
    });
  });
});
