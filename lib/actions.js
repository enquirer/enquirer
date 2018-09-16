'use strict';

/**
 * Default keypress actions
 */

module.exports = {
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
