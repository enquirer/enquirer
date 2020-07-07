'use strict';

/**
 * Actions are mappings from keypress event names to method names
 * in the prompts.
 */

exports.ctrl = {
  a: 'first',
  b: 'backward',
  c: 'cancel',
  d: 'deleteForward',
  e: 'last',
  f: 'forward',
  g: 'reset',
  i: 'tab',
  j: 'submit',
  k: 'cutForward',
  l: 'reset',
  m: 'cancel',
  n: 'newItem',
  p: 'search',
  r: 'remove',
  s: 'save',
  u: 'undo',
  v: 'paste',
  w: 'cutLeft',
  x: 'toggleCursor'
};

exports.shift = {
  up: 'shiftUp',
  down: 'shiftDown',
  left: 'shiftLeft',
  right: 'shiftRight',
  tab: 'prev'
};

exports.fn = {
  up: 'pageUp',
  down: 'pageDown',
  left: 'pageLeft',
  right: 'pageRight',
  delete: 'deleteForward'
};

// <alt> on Windows
exports.option = {
  b: 'backward',
  d: 'cutRight',
  f: 'forward',
  left: 'cutLeft',
  up: 'altUp',
  down: 'altDown'
};

exports.keys = {
  pageup: 'pageUp', // <fn>+<up> (mac), <Page Up> (windows)
  pagedown: 'pageDown', // <fn>+<down> (mac), <Page Down> (windows)
  home: 'home', // <fn>+<left> (mac), <home> (windows)
  end: 'end', // <fn>+<right> (mac), <end> (windows)
  cancel: 'cancel',
  escape: 'cancel',
  delete: 'deleteForward',
  backspace: 'delete',
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down',
  enter: 'submit',
  return: 'submit',
  space: 'space',
  number: 'number',
  tab: 'next'
};
