'use strict';

const actions = {
  ctrl: {
    a: 'first',
    c: 'cancel',
    d: 'cancel',
    e: 'last',
    g: 'reset',
    r: 'remove',
    s: 'save',
    u: 'undo',
    z: 'undo'
  },

  shift: {
    up: 'shiftUp',
    down: 'shiftDown',
    left: 'shiftLeft',
    right: 'shiftRight',
    tab: 'shiftTab'
  },

  keys: {
    pageup: 'pageUp', // <fn>+<up> (mac) or <Page Up> (windows)
    pagedown: 'pageDown', // <fn>+<down> (mac) or <Page Down> (windows)
    cancel: 'cancel',
    backspace: 'delete',
    down: 'down',
    enter: 'submit',
    escape: 'cancel',
    left: 'left',
    space: 'space',
    number: 'number',
    return: 'submit',
    right: 'right',
    tab: 'tab',
    up: 'up'
  }
};

module.exports = (key = {}) => {
  if (key.ctrl && actions.ctrl[key.name]) {
    key.action = actions.ctrl[key.name];
    return key;
  }

  if (key.shift && actions.shift[key.name]) {
    key.action = actions.shift[key.name];
    return key;
  }

  key.action = actions.keys[key.name];
  return key;
};
