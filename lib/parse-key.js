/**
 * Parse the key from a keypress event
 */

const mappings = {
  /* xterm/gnome ESC O letter */
  OP: key => (key.name = 'f1'),
  OQ: key => (key.name = 'f2'),
  OR: key => (key.name = 'f3'),
  OS: key => (key.name = 'f4'),

  /* xterm/rxvt ESC [ number ~ */
  '[11~': key => (key.name = 'f1'),
  '[12~': key => (key.name = 'f2'),
  '[13~': key => (key.name = 'f3'),
  '[14~': key => (key.name = 'f4'),

  /* from Cygwin and used in libuv */
  '[[A': key => (key.name = 'f1'),
  '[[B': key => (key.name = 'f2'),
  '[[C': key => (key.name = 'f3'),
  '[[D': key => (key.name = 'f4'),
  '[[E': key => (key.name = 'f5'),

  /* common */
  '[15~': key => (key.name = 'f5'),
  '[17~': key => (key.name = 'f6'),
  '[18~': key => (key.name = 'f7'),
  '[19~': key => (key.name = 'f8'),
  '[20~': key => (key.name = 'f9'),
  '[21~': key => (key.name = 'f10'),
  '[23~': key => (key.name = 'f11'),
  '[24~': key => (key.name = 'f12'),

  /* xterm ESC [ letter */
  '[A': key => (key.name = 'up'),
  '[B': key => (key.name = 'down'),
  '[C': key => (key.name = 'right'),
  '[D': key => (key.name = 'left'),
  '[E': key => (key.name = 'clear'),
  '[F': key => (key.name = 'end'),
  '[H': key => (key.name = 'home'),

  /* xterm/gnome ESC O letter */
  OA: key => (key.name = 'up'),
  OB: key => (key.name = 'down'),
  OC: key => (key.name = 'right'),
  OD: key => (key.name = 'left'),
  OE: key => (key.name = 'clear'),
  OF: key => (key.name = 'end'),
  OH: key => (key.name = 'home'),

  /* xterm/rxvt ESC [ number ~ */
  '[1~': key => (key.name = 'home'),
  '[2~': key => (key.name = 'insert'),
  '[3~': key => (key.name = 'delete'),
  '[4~': key => (key.name = 'end'),
  '[5~': key => (key.name = 'pageup'),
  '[6~': key => (key.name = 'pagedown'),

  /* putty */
  '[[5~': key => (key.name = 'pageup'),
  '[[6~': key => (key.name = 'pagedown'),

  /* rxvt */
  '[7~': key => (key.name = 'home'),
  '[8~': key => (key.name = 'end'),

  /* rxvt keys with modifiers */
  '[a': key => {
    key.name = 'up';
    key.shift = true;
  },
  '[b': key => {
    key.name = 'down';
    key.shift = true;
  },
  '[c': key => {
    key.name = 'right';
    key.shift = true;
  },
  '[d': key => {
    key.name = 'left';
    key.shift = true;
  },
  '[e': key => {
    key.name = 'clear';
    key.shift = true;
  },

  '[2$': key => {
    key.name = 'insert';
    key.shift = true;
  },
  '[3$': key => {
    key.name = 'delete';
    key.shift = true;
  },
  '[5$': key => {
    key.name = 'pageup';
    key.shift = true;
  },
  '[6$': key => {
    key.name = 'pagedown';
    key.shift = true;
  },
  '[7$': key => {
    key.name = 'home';
    key.shift = true;
  },
  '[8$': key => {
    key.name = 'end';
    key.shift = true;
  },

  Oa: key => {
    key.name = 'up';
    key.ctrl = true;
  },
  Ob: key => {
    key.name = 'down';
    key.ctrl = true;
  },
  Oc: key => {
    key.name = 'right';
    key.ctrl = true;
  },
  Od: key => {
    key.name = 'left';
    key.ctrl = true;
  },
  Oe: key => {
    key.name = 'clear';
    key.ctrl = true;
  },

  '[2^': key => {
    key.name = 'insert';
    key.ctrl = true;
  },
  '[3^': key => {
    key.name = 'delete';
    key.ctrl = true;
  },
  '[5^': key => {
    key.name = 'pageup';
    key.ctrl = true;
  },
  '[6^': key => {
    key.name = 'pagedown';
    key.ctrl = true;
  },
  '[7^': key => {
    key.name = 'home';
    key.ctrl = true;
  },
  '[8^': key => {
    key.name = 'end';
    key.ctrl = true;
  },

  /* misc. */
  '[Z': key => {
    key.name = 'tab';
    key.shift = true;
  }
};

module.exports = (key, code) => {
  let fn = mappings[code];
  return fn && fn(key);
};

