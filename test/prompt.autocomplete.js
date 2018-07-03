'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const { timeout, expect } = support(assert);
const AutoComplete = require('../prompts/autocomplete');
let prompt;

class Prompt extends AutoComplete {
  constructor(options = {}) {
    super({ ...options, show: false });
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

    it('should filter by keypress', () => {
      prompt = new Prompt({
        message: 'Favorite letters?',
        choices: [
          { message: 'aab', value: 'A' },
          { message: 'aac', value: 'BB' },
          { message: 'abb', value: 'CCC' },
          { message: 'abc', value: 'DDDD' }
        ]
      });

      prompt.on('run', async() => {
        await timeout(() => prompt.keypress('a'));
        await timeout(() => prompt.keypress('b'));
        await timeout(() => prompt.keypress('c'));
        await timeout(() => prompt.submit());
      });

      return prompt.run().then(answer => {
        assert.equal(answer, 'DDDD');
      });
    });
  });

  describe('options.choices', () => {
    it('should add an array of choice objects', () => {
      prompt = new Prompt({
        message: 'Favorite letters?',
        choices: [
          { value: 'a', message: 'A' },
          { value: 'b', message: 'BB' },
          { value: 'c', message: 'CCC' },
          { value: 'd', message: 'DDDD' }
        ]
      });

      assert.has(prompt.choices, [
        { value: 'a', message: 'A', enabled: false },
        { value: 'b', message: 'BB', enabled: false },
        { value: 'c', message: 'CCC', enabled: false },
        { value: 'd', message: 'DDDD', enabled: false }
      ]);

      assert.equal(prompt.initial, void 0);
    });
  });

  describe('options.value', () => {
    it('should return early with options.value when defined', () => {
      prompt = new Prompt({
        message: 'Favorite letters?',
        value: 'b',
        choices: [
          { name: 'a', value: 'FOO', message: 'A' },
          { name: 'b', value: 'BAR', message: 'BB' },
          { name: 'c', value: 'BAZ', message: 'CCC' },
          { name: 'd', value: 'QUX', message: 'DDDD' }
        ]
      });

      return prompt.run()
        .then(function(answer) {
          assert.equal(answer, 'BAR');
        });
    });
  });

  describe('options.initial', () => {
    it('should use initial answer when answer is undefined', () => {
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

      assert.equal(prompt.initial, 2);
      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(function(answer) {
          assert.equal(answer, 'c');
        });
    });
  });

  describe('options.suggest', () => {
    it('should support a custom suggest function', () => {
      prompt = new Prompt({
        message: 'Favorite flavor?',
        suggest(typed) {
          return this.choices.filter(choice => choice.message.includes(typed));
        },
        choices: [
          'almond',
          'apple',
          'banana',
          'cherry',
          'chocolate',
          'cinnamon',
          'coconut',
          'cotton candy',
          'grape',
          'nougat',
          'orange',
          'pear',
          'pineapple',
          'strawberry',
          'vanilla',
          'watermelon',
          'wintergreen'
        ]
      });

      prompt.on('run', async() => {
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
          { name: 'coconut', value: 'COCONUT' },
        ]
      });

      prompt.on('run', async() => {
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
