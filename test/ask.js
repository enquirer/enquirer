'use strict';

require('mocha');
var assert = require('assert');
var Enquirer = require('..');
var enquirer;
var unmute;

describe('.ask', function() {
  beforeEach(function() {
    enquirer = new Enquirer();
    enquirer.question('fixture');
    enquirer.once('prompt', function(prompt) {
      unmute = prompt.mute();
    });
  });

  afterEach(function() {
    unmute();
  });

  it('should add input from multiple keypress events to readline', function() {
    enquirer.on('ask', function(prompt) {
      prompt.rl.input.emit('keypress', 'f');
      prompt.rl.input.emit('keypress', 'o');
      prompt.rl.input.emit('keypress', 'o');
      prompt.rl.input.emit('keypress', '\n');
    });

    return enquirer.prompt('fixture')
      .then(function(answer) {
        assert.deepEqual(answer, {fixture: 'foo'});
        return answer;
      });
  });

  it('should emit multiple times for multiple characters', function() {
    enquirer.on('ask', function(prompt) {
      prompt.rl.input.emit('keypress', 'foo\n');
    });

    return enquirer.prompt('fixture')
      .then(function(answer) {
        assert.deepEqual(answer, {fixture: 'foo'});
        return answer;
      })
  });

  it('should emit answer', function(cb) {
    enquirer.on('answer', function(answer) {
      assert.deepEqual(answer, 'foo');
      cb();
    });

    enquirer.on('ask', function(prompt) {
      prompt.rl.input.emit('keypress', 'foo\n');
    });

    enquirer.ask(function(answer) {
    });
  });

  it('should set prompt.answer', function(cb) {
    enquirer.on('ask', function(prompt) {
      prompt.on('answer', function() {
        assert.equal(prompt.answer, 'foo');
        cb();
      });

      prompt.rl.input.emit('keypress', 'foo\n');
    });

    enquirer.prompt('fixture');
  });
});
