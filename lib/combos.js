/**
 * Actions are mappings from keypress event names to method names
 * in the prompts.
 */

const combos = Object.create({})

combos.ctrl = {
  a: 'first',
  b: 'backward',
  c: 'cancel',
  d: 'deleteForward',
  e: 'last',
  f: 'forward',
  g: 'reset',
  i: 'tab',
  k: 'cutForward',
  l: 'reset',
  n: 'newItem',
  m: 'cancel',
  j: 'submit',
  p: 'search',
  r: 'remove',
  s: 'save',
  u: 'undo',
  w: 'cutLeft',
  x: 'toggleCursor',
  v: 'paste'
};

combos.shift = {
  up: 'shiftUp',
  down: 'shiftDown',
  left: 'shiftLeft',
  right: 'shiftRight',
  tab: 'prev'
};

combos.fn = {
  up: 'pageUp',
  down: 'pageDown',
  left: 'pageLeft',
  right: 'pageRight',
  delete: 'deleteForward'
};

// <alt> on Windows
combos.option = {
  b: 'backward',
  f: 'forward',
  d: 'cutRight',
  left: 'cutLeft',
  up: 'altUp',
  down: 'altDown'
};

combos.keys = {
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

export default combos