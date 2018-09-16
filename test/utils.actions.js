'use strict';

require('mocha');
const assert = require('assert');
const actions = require('../lib/action');
const keypress = require('../lib/keypress');
const action = key => actions(keypress(null, key)).action;

describe('utils.actions', function() {
  it('should decorate actions on keypress events', () => {
    assert.equal(action({ name: 'cancel' }), 'cancel');
    assert.equal(action({ name: 'backspace' }), 'delete');
    assert.equal(action({ name: 'down' }), 'down');
    assert.equal(action({ name: 'enter' }), 'submit');
    assert.equal(action({ name: 'escape' }), 'cancel');
    assert.equal(action({ name: 'left' }), 'left');
    assert.equal(action({ name: 'number' }), 'number');
    assert.equal(action({ name: 'return' }), 'submit');
    assert.equal(action({ name: 'right' }), 'right');
    assert.equal(action({ name: 'tab' }), 'tab');
    assert.equal(action({ name: 'up' }), 'up');
  });

  it('should decorate actions for ctrl+', () => {
    assert.equal(action({ name: 'c', ctrl: true }), 'cancel');
    assert.equal(action({ name: 'a', ctrl: true }), 'first');
    assert.equal(action({ name: 'c', ctrl: true }), 'cancel');
    assert.equal(action({ name: 'd', ctrl: true }), 'cancel');
    assert.equal(action({ name: 'e', ctrl: true }), 'last');
    assert.equal(action({ name: 'g', ctrl: true }), 'reset');
    assert.equal(action({ name: 'r', ctrl: true }), 'remove');
    assert.equal(action({ name: 's', ctrl: true }), 'save');
    assert.equal(action({ name: 'u', ctrl: true }), 'undo');
    assert.equal(action({ name: 'z', ctrl: true }), 'undo');
  });

  it('should decorate actions for shift+', () => {
    assert.equal(action({ name: 'down', shift: true }), 'shiftDown');
    assert.equal(action({ name: 'left', shift: true }), 'shiftLeft');
    assert.equal(action({ name: 'right', shift: true }), 'shiftRight');
    assert.equal(action({ name: 'tab', shift: true }), 'shiftTab');
    assert.equal(action({ name: 'up', shift: true }), 'shiftUp');
  });

  it('should handle numbers', () => {
    assert.equal(actions(keypress('0', { name: '0' })).name, 'number');
    assert.equal(actions(keypress('1', { name: '1' })).name, 'number');
    assert.equal(actions(keypress('2', { name: '2' })).name, 'number');
    assert.equal(actions(keypress('3', { name: '3' })).name, 'number');
    assert.equal(actions(keypress('4', { name: '4' })).name, 'number');
    assert.equal(actions(keypress('5', { name: '5' })).name, 'number');
    assert.equal(actions(keypress('6', { name: '6' })).name, 'number');
    assert.equal(actions(keypress('7', { name: '7' })).name, 'number');
    assert.equal(actions(keypress('8', { name: '8' })).name, 'number');
    assert.equal(actions(keypress('9', { name: '9' })).name, 'number');
  });

  it('should handle shift+number', () => {
    assert.equal(actions(keypress('!', { name: '!', shift: true })).name, '!');
    assert.equal(actions(keypress('@', { name: '@', shift: true })).name, '@');
    assert.equal(actions(keypress('#', { name: '#', shift: true })).name, '#');
    assert.equal(actions(keypress('$', { name: '$', shift: true })).name, '$');
    assert.equal(actions(keypress('%', { name: '%', shift: true })).name, '%');
    assert.equal(actions(keypress('^', { name: '^', shift: true })).name, '^');
    assert.equal(actions(keypress('&', { name: '&', shift: true })).name, '&');
    assert.equal(actions(keypress('*', { name: '*', shift: true })).name, '*');
    assert.equal(actions(keypress('(', { name: '(', shift: true })).name, '(');
    assert.equal(actions(keypress(')', { name: ')', shift: true })).name, ')');
  });
});
