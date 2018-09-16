/**
 * Parse the key from a keypress event
 */

const mappings = {
  /* xterm/gnome ESC O letter */
  OP: key => {
    key.name = 'f1';
    return key;
  },
  OQ: key => {
    key.name = 'f2';
    return key;
  },
  OR: key => {
    key.name = 'f3';
    return key;
  },
  OS: key => {
    key.name = 'f4';
    return key;
  },

  /* xterm/rxvt ESC [ number ~ */
  '[11~': key => {
    key.name = 'f1';
    return key;
  },
  '[12~': key => {
    key.name = 'f2';
    return key;
  },
  '[13~': key => {
    key.name = 'f3';
    return key;
  },
  '[14~': key => {
    key.name = 'f4';
    return key;
  },

  /* from Cygwin and used in libuv */
  '[[A': key => {
    key.name = 'f1';
    return key;
  },
  '[[B': key => {
    key.name = 'f2';
    return key;
  },
  '[[C': key => {
    key.name = 'f3';
    return key;
  },
  '[[D': key => {
    key.name = 'f4';
    return key;
  },
  '[[E': key => {
    key.name = 'f5';
    return key;
  },

  /* common */
  '[15~': key => {
    key.name = 'f5';
    return key;
  },
  '[17~': key => {
    key.name = 'f6';
    return key;
  },
  '[18~': key => {
    key.name = 'f7';
    return key;
  },
  '[19~': key => {
    key.name = 'f8';
    return key;
  },
  '[20~': key => {
    key.name = 'f9';
    return key;
  },
  '[21~': key => {
    key.name = 'f10';
    return key;
  },
  '[23~': key => {
    key.name = 'f11';
    return key;
  },
  '[24~': key => {
    key.name = 'f12';
    return key;
  },

  /* xterm ESC [ letter */
  '[A': key => {
    key.name = 'up';
    return key;
  },
  '[B': key => {
    key.name = 'down';
    return key;
  },
  '[C': key => {
    key.name = 'right';
    return key;
  },
  '[D': key => {
    key.name = 'left';
    return key;
  },
  '[E': key => {
    key.name = 'clear';
    return key;
  },
  '[F': key => {
    key.name = 'end';
    return key;
  },
  '[H': key => {
    key.name = 'home';
    return key;
  },

  /* xterm/gnome ESC O letter */
  OA: key => {
    key.name = 'up';
    return key;
  },
  OB: key => {
    key.name = 'down';
    return key;
  },
  OC: key => {
    key.name = 'right';
    return key;
  },
  OD: key => {
    key.name = 'left';
    return key;
  },
  OE: key => {
    key.name = 'clear';
    return key;
  },
  OF: key => {
    key.name = 'end';
    return key;
  },
  OH: key => {
    key.name = 'home';
    return key;
  },

  /* xterm/rxvt ESC [ number ~ */
  '[1~': key => {
    key.name = 'home';
    return key;
  },
  '[2~': key => {
    key.name = 'insert';
    return key;
  },
  '[3~': key => {
    key.name = 'delete';
    return key;
  },
  '[4~': key => {
    key.name = 'end';
    return key;
  },
  '[5~': key => {
    key.name = 'pageup';
    return key;
  },
  '[6~': key => {
    key.name = 'pagedown';
    return key;
  },

  /* putty */
  '[[5~': key => {
    key.name = 'pageup';
    return key;
  },
  '[[6~': key => {
    key.name = 'pagedown';
    return key;
  },

  /* rxvt */
  '[7~': key => {
    key.name = 'home';
    return key;
  },
  '[8~': key => {
    key.name = 'end';
    return key;
  },

  /* rxvt keys with modifiers */
  '[a': key => {
    key.name = 'up';
    key.shift = true;
    return key;
  },
  '[b': key => {
    key.name = 'down';
    key.shift = true;
    return key;
  },
  '[c': key => {
    key.name = 'right';
    key.shift = true;
    return key;
  },
  '[d': key => {
    key.name = 'left';
    key.shift = true;
    return key;
  },
  '[e': key => {
    key.name = 'clear';
    key.shift = true;
    return key;
  },

  '[2$': key => {
    key.name = 'insert';
    key.shift = true;
    return key;
  },
  '[3$': key => {
    key.name = 'delete';
    key.shift = true;
    return key;
  },
  '[5$': key => {
    key.name = 'pageup';
    key.shift = true;
    return key;
  },
  '[6$': key => {
    key.name = 'pagedown';
    key.shift = true;
    return key;
  },
  '[7$': key => {
    key.name = 'home';
    key.shift = true;
    return key;
  },
  '[8$': key => {
    key.name = 'end';
    key.shift = true;
    return key;
  },

  Oa: key => {
    key.name = 'up';
    key.ctrl = true;
    return key;
  },
  Ob: key => {
    key.name = 'down';
    key.ctrl = true;
    return key;
  },
  Oc: key => {
    key.name = 'right';
    key.ctrl = true;
    return key;
  },
  Od: key => {
    key.name = 'left';
    key.ctrl = true;
    return key;
  },
  Oe: key => {
    key.name = 'clear';
    key.ctrl = true;
    return key;
  },

  '[2^': key => {
    key.name = 'insert';
    key.ctrl = true;
    return key;
  },
  '[3^': key => {
    key.name = 'delete';
    key.ctrl = true;
    return key;
  },
  '[5^': key => {
    key.name = 'pageup';
    key.ctrl = true;
    return key;
  },
  '[6^': key => {
    key.name = 'pagedown';
    key.ctrl = true;
    return key;
  },
  '[7^': key => {
    key.name = 'home';
    key.ctrl = true;
    return key;
  },
  '[8^': key => {
    key.name = 'end';
    key.ctrl = true;
    return key;
  },

  /* misc. */
  '[Z': key => {
    key.name = 'tab';
    key.shift = true;
    return key;
  }
};

module.exports = (key, code) => {
  let fn = mappings[code];
  if (fn) return fn(key);
  return key;
};

