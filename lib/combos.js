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
  h: 'backspace',
  i: 'tab',
  j: 'submit',
  k: 'cutForward',
  l: 'reset',
  m: 'submit',
  n: 'newItem',
  p: 'search',
  // q: undefined, // can be used
  r: 'remove',
  s: 'save',
  t: 'toggleCursor',
  u: 'undo',
  v: 'paste',
  w: 'cutLeft',
  x: 'cut'
  // y: undefined, // can be used
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
  f: 'forward',
  d: 'cutRight',
  left: 'cutLeft',
  up: 'altUp',
  down: 'altDown',
  space: 'altSpace'
};

exports.keys = {
  pageup: 'pageUp', // <fn>+<up> (mac), <Page Up> (windows)
  pagedown: 'pageDown', // <fn>+<down> (mac), <Page Down> (windows)
  home: 'home', // <fn>+<left> (mac), <home> (windows)
  end: 'end', // <fn>+<right> (mac), <end> (windows)
  cancel: 'cancel',
  delete: 'deleteForward',
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
};
