'use strict';

const keypmap = {
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
  if (key.ctrl && keypmap.ctrl[key.name]) {
    key.action = keypmap.ctrl[key.name];
    return key;
  }

  if (key.shift && keypmap.shift[key.name]) {
    key.action = keypmap.shift[key.name];
    return key;
  }

  key.action = keypmap.keys[key.name];
  return key;
};
