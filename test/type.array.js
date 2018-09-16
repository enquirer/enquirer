'use strict';

require('mocha');
const assert = require('assert');
const support = require('./support');
const ArrayPrompt = require('../lib/types/array');
const { expect } = support(assert);
let prompt;

class Prompt extends ArrayPrompt {
  constructor(options = {}) {
    super({ ...options, show: false });
  }
  render() {}
}

describe('array prompt', function() {
  describe('options.choices', () => {
    it('should add an array of choice objects', cb => {
      prompt = new Prompt({
        message: 'prompt-array',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.on('run', () => {
        assert.has(prompt.choices, [
          { name: 'a', message: 'A', enabled: false },
          { name: 'b', message: 'BB', enabled: false },
          { name: 'c', message: 'CCC', enabled: false },
          { name: 'd', message: 'DDDD', enabled: false }
        ]);
        cb();
      });

      prompt.run().catch(cb);;
    });

    it('should add an array of choice strings', cb => {
      prompt = new Prompt({
        message: 'prompt-array',
        choices: [
          'a',
          'b',
          'c',
          'd'
        ]
      });

      prompt.on('run', () => {
        assert.has(prompt.choices, [
          { name: 'a', message: 'a', enabled: false },
          { name: 'b', message: 'b', enabled: false },
          { name: 'c', message: 'c', enabled: false },
          { name: 'd', message: 'd', enabled: false }
        ]);
        cb();
      });

      prompt.run().catch(cb);;
    });
  });

  describe('options.initial', () => {
    it('should take a number as options.initial', cb => {
      prompt = new Prompt({
        message: 'prompt-array',
        initial: 2,
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.initial, 2);
        prompt.submit();
        cb();
      });

      prompt.run()
        .then(answer => {
          assert.equal(answer, 'c');
        })
        .catch(cb);
    });
  });

  describe('options.value', () => {
    it('should use options.value', () => {
      prompt = new Prompt({
        message: 'prompt-array',
        value: 'b',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 'b');
        });
    });

    it('should not use initial value when answer is given', cb => {
      prompt = new Prompt({
        message: 'prompt-array',
        initial: 2,
        value: 'a',
        choices: [
          { name: 'a', message: 'A' },
          { name: 'b', message: 'BB' },
          { name: 'c', message: 'CCC' },
          { name: 'd', message: 'DDDD' }
        ]
      });

      prompt.once('run', () => {
        assert.equal(prompt.initial, 2);
        prompt.submit();
        cb();
      });

      prompt.run().then(expect('a')).catch(cb);
    });
  });
});
