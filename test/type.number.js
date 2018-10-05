'use strict';

require('mocha');
const assert = require('assert');
const NumberPrompt = require('../lib/types/number');
const { immediate } = require('./support')(assert);
const reset = { name: 'g', ctrl: true };
const down = { name: 'down' };
const up = { name: 'up' };
let prompt;

class Prompt extends NumberPrompt {
  constructor(options) {
    super({ ...options, show: false });
  }
}

describe('number prompt', function() {
  describe('options.min', () => {
    it('should set prompt.min with options.min', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        min: 10,
        value: 15
      });

      assert.equal(prompt.min, 10);
      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 15);
        });
    });
  });

  describe('options.max', () => {
    it('should set prompt.max with options.max', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        max: 10,
        value: 5
      });

      assert.equal(prompt.max, 10);
      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 5);
        });
    });
  });

  describe('options.float', () => {
    it('should allow floats when options.float is true', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        float: true,
        value: 42.42
      });

      assert.equal(prompt.float, true);
      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 42.42);
        });
    });

    it('should round when options.float is false', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        float: false
      });

      assert.equal(prompt.float, false);

      prompt.on('run', async() => {
        await immediate(async() => prompt.keypress('4'));
        await immediate(async() => assert.equal(prompt.input, 4));
        await immediate(async() => prompt.keypress('2'));
        await immediate(async() => assert.equal(prompt.input, 42));
        await immediate(async() => prompt.keypress('.'));
        await immediate(async() => assert.equal(prompt.input, 42));
        await immediate(async() => prompt.keypress('8'));
        await immediate(async() => assert.equal(prompt.input, 42.8));
        await immediate(async() => prompt.keypress('2'));
        await immediate(async() => assert.equal(prompt.input, 42.82));
        await immediate(async() => prompt.submit());
      });

      return prompt.run()
        .then(value => {
          assert.equal(prompt.input, 42.82);
          assert.equal(prompt.value, 43);
          assert.equal(value, 43);
        });
    });
  });

  describe('options.minor', () => {
    it('should support options.minor', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        minor: 5
      });

      assert.equal(prompt.minor, 5);
      prompt.on('run', async() => {
        await immediate(async() => prompt.keypress(null, up));
        await immediate(async() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 5);
        });
    });

    it('should return zero when submitted with no val and options.minor', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        minor: 5
      });

      assert.equal(prompt.minor, 5);
      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 0);
        });
    });

    it('should increment and decrement by options.step', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        minor: 5,
        initial: 37
      });

      assert.equal(prompt.minor, 5);

      prompt.on('run', async() => {
        await immediate(() => prompt.keypress(null, up));
        await immediate(() => prompt.keypress(null, up));
        await immediate(() => prompt.keypress(null, up));
        await immediate(() => prompt.keypress(null, down));
        await immediate(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 47);
        });
    });

    it('should increment and decrement floats', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        minor: 5,
        initial: 37.2
      });

      assert.equal(prompt.minor, 5);

      prompt.on('run', async() => {
        await immediate(async() => prompt.keypress(null, up));
        await immediate(async() => prompt.keypress(null, up));
        await immediate(async() => prompt.keypress(null, up));
        await immediate(async() => prompt.keypress(null, down));
        await immediate(async() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 47.2);
        });
    });

    it('should increment and decrement and round floats when disabled', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        minor: 5,
        initial: 37.6,
        float: false
      });

      assert.equal(prompt.minor, 5);

      prompt.on('run', async() => {
        await immediate(async() => prompt.keypress(null, up));
        await immediate(async() => prompt.keypress(null, up));
        await immediate(async() => prompt.keypress(null, up));
        await immediate(async() => prompt.keypress(null, down));
        await immediate(async() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 48);
        });
    });
  });

  describe('options.initial', () => {
    it('should use options.initial when 0', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        initial: 0
      });

      assert.equal(prompt.initial, 0);
      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 0);
        });
    });

    it('should use options.initial', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        initial: 42
      });

      assert.equal(prompt.initial, 42);
      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 42);
        });
    });
  });

  describe('prompt.reset', () => {
    it('should reset the prompt to options.initial', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        minor: 5,
        initial: 37.6
      });

      assert.equal(prompt.minor, 5);

      prompt.on('run', async() => {
        await immediate(async() => prompt.keypress(null, up));
        await immediate(async() => assert.equal(prompt.input, 42.6));
        await immediate(async() => prompt.keypress(null, up));
        await immediate(async() => assert.equal(prompt.input, 47.6));
        await immediate(async() => prompt.keypress(null, up));
        await immediate(async() => assert.equal(prompt.input, 52.6));
        await immediate(async() => prompt.keypress(null, down));
        await immediate(async() => assert.equal(prompt.input, 47.6));
        await immediate(async() => prompt.keypress(null, reset));
        await immediate(async() => assert.equal(prompt.input, ''));
        await immediate(async() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(prompt.value, 37.6);
          assert.equal(answer, 37.6);
        });
    });
  });
});
