'use strict';

require('mocha');
const assert = require('assert');
const keypress = require('../lib/keypress');
const act = key => keypress.action(null, key).action;

describe('utils.actions', function() {
  it('should decorate actions on keypress events', () => {
    assert.equal(act({ name: 'cancel' }), 'cancel');
    assert.equal(act({ name: 'backspace' }), 'delete');
    assert.equal(act({ name: 'down' }), 'down');
    assert.equal(act({ name: 'enter' }), 'submit');
    assert.equal(act({ name: 'escape' }), 'cancel');
    assert.equal(act({ name: 'left' }), 'left');
    assert.equal(act({ name: 'number' }), 'number');
    assert.equal(act({ name: 'return' }), 'submit');
    assert.equal(act({ name: 'right' }), 'right');
    assert.equal(act({ name: 'tab' }), 'next');
    assert.equal(act({ name: 'up' }), 'up');
  });

  it('should decorate actions for ctrl+', () => {
    assert.equal(act({ name: 'c', ctrl: true }), 'cancel');
    assert.equal(act({ name: 'a', ctrl: true }), 'first');
    assert.equal(act({ name: 'c', ctrl: true }), 'cancel');
    assert.equal(act({ name: 'd', ctrl: true }), 'cancel');
    assert.equal(act({ name: 'e', ctrl: true }), 'last');
    assert.equal(act({ name: 'g', ctrl: true }), 'reset');
    assert.equal(act({ name: 'r', ctrl: true }), 'remove');
    assert.equal(act({ name: 's', ctrl: true }), 'save');
    assert.equal(act({ name: 'u', ctrl: true }), 'undo');
  });

  it('should decorate actions for shift+', () => {
    assert.equal(act({ name: 'down', shift: true }), 'shiftDown');
    assert.equal(act({ name: 'left', shift: true }), 'shiftLeft');
    assert.equal(act({ name: 'right', shift: true }), 'shiftRight');
    assert.equal(act({ name: 'up', shift: true }), 'shiftUp');
    assert.equal(act({ name: 'tab', shift: true }), 'prev');
  });

  it('should handle numbers', () => {
    assert.equal(keypress('0', { name: '0' }).name, 'number');
    assert.equal(keypress('1', { name: '1' }).name, 'number');
    assert.equal(keypress('2', { name: '2' }).name, 'number');
    assert.equal(keypress('3', { name: '3' }).name, 'number');
    assert.equal(keypress('4', { name: '4' }).name, 'number');
    assert.equal(keypress('5', { name: '5' }).name, 'number');
    assert.equal(keypress('6', { name: '6' }).name, 'number');
    assert.equal(keypress('7', { name: '7' }).name, 'number');
    assert.equal(keypress('8', { name: '8' }).name, 'number');
    assert.equal(keypress('9', { name: '9' }).name, 'number');
  });

  it('should handle shift+number', () => {
    assert.equal(keypress('!', { name: '!', shift: true }).name, '!');
    assert.equal(keypress('@', { name: '@', shift: true }).name, '@');
    assert.equal(keypress('#', { name: '#', shift: true }).name, '#');
    assert.equal(keypress('$', { name: '$', shift: true }).name, '$');
    assert.equal(keypress('%', { name: '%', shift: true }).name, '%');
    assert.equal(keypress('^', { name: '^', shift: true }).name, '^');
    assert.equal(keypress('&', { name: '&', shift: true }).name, '&');
    assert.equal(keypress('*', { name: '*', shift: true }).name, '*');
    assert.equal(keypress('(', { name: '(', shift: true }).name, '(');
    assert.equal(keypress(')', { name: ')', shift: true }).name, ')');
  });
});
