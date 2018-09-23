'use strict';

require('mocha');
const assert = require('assert');
const NumberPrompt = require('../lib/types/number');
const { nextTick } = require('./support')(assert);
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
        await nextTick(() => prompt.keypress('4'));
        await nextTick(async() => assert.equal(prompt.typed, 4));
        await nextTick(() => prompt.keypress('2'));
        await nextTick(async() => assert.equal(prompt.typed, 42));
        await nextTick(() => prompt.keypress('.'));
        await nextTick(async() => assert.equal(prompt.typed, 42));
        await nextTick(() => prompt.keypress('8'));
        await nextTick(async() => assert.equal(prompt.typed, 42.8));
        await nextTick(() => prompt.keypress('2'));
        await nextTick(async() => assert.equal(prompt.typed, 42.82));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(prompt.typed, 42.82);
          assert.equal(answer, 43);
        });
    });
  });

  describe('options.increment', () => {
    it('should support options.increment', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        increment: 5
      });

      assert.equal(prompt.step, 5);
      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 5);
        });
    });

    it('should return zero when submitted with no val and options.increment', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        increment: 5
      });

      assert.equal(prompt.step, 5);
      prompt.on('run', () => prompt.submit());

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 0);
        });
    });

    it('should increment and decrement by options.step', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        increment: 5,
        initial: 37
      });

      assert.equal(prompt.step, 5);

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(null, down));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 47);
        });
    });

    it('should increment and decrement floats', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        increment: 5,
        initial: 37.2
      });

      assert.equal(prompt.step, 5);

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(null, down));
        await nextTick(() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(answer, 47.2);
        });
    });

    it('should increment and decrement and round floats when disabled', () => {
      prompt = new Prompt({
        message: 'prompt-number',
        increment: 5,
        initial: 37.6,
        float: false
      });

      assert.equal(prompt.step, 5);

      prompt.on('run', async() => {
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(null, up));
        await nextTick(() => prompt.keypress(null, down));
        await nextTick(() => prompt.submit());
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
        increment: 5,
        initial: 37.6
      });

      assert.equal(prompt.step, 5);

      prompt.on('run', async() => {
        await nextTick(async() => prompt.keypress(null, up));
        await nextTick(async() => assert.equal(prompt.typed, 42.6));
        await nextTick(async() => prompt.keypress(null, up));
        await nextTick(async() => assert.equal(prompt.typed, 47.6));
        await nextTick(async() => prompt.keypress(null, up));
        await nextTick(async() => assert.equal(prompt.typed, 52.6));
        await nextTick(async() => prompt.keypress(null, down));
        await nextTick(async() => assert.equal(prompt.typed, 47.6));
        await nextTick(async() => prompt.keypress(null, reset));
        await nextTick(async() => assert.equal(prompt.typed, ''));
        await nextTick(async() => prompt.submit());
      });

      return prompt.run()
        .then(answer => {
          assert.equal(prompt.value, 37.6);
          assert.equal(answer, 37.6);
        });
    });
  });
});
