'use strict';

const actions = {
  ctrl: {
    a: 'first',
    b: 'left',
    c: 'cancel',
    d: 'cancel',
    e: 'last',
    f: 'right',
    g: 'reset',
    i: 'tab',
    l: 'reset',
    j: 'submit',
    r: 'remove',
    s: 'save',
    u: 'undo'
  },

  shift: {
    up: 'shiftUp',
    down: 'shiftDown',
    left: 'shiftLeft',
    right: 'shiftRight',
    tab: 'prev'
  },

  fn: {
    up: 'pageUp',
    down: 'pageDown',
    left: 'pageLeft',
    right: 'pageRight'
  },

  keys: {
    pageup: 'pageUp', // <fn>+<up> (mac) or <Page Up> (windows)
    pagedown: 'pageDown', // <fn>+<down> (mac) or <Page Down> (windows)
    home: 'home', // <fn>+<left>
    end: 'end', // <fn>+<right>
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

