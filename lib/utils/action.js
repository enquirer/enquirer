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
    tab: 'prev'
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
    tab: 'next',
    up: 'up'
  }
};

module.exports = (key = {}) => {
  if (key.raw === '\r') key.raw = void 0;
  if (key.ctrl) {
    key.action = actions.ctrl[key.name];
    return key;
  }
  if (key.shift) {
    key.action = actions.shift[key.name];
    return key;
  }

  key.action = actions.keys[key.name];
  return key;
};

