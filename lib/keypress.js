'use strict';

const parseKey = require('./parse-key');

/**
 * Based on https://github.com/TooTallNate/keypress
 */

const parseKeypress = (s, event) => {
  // Regular expressions used for ansi escape code splitting
  /* eslint no-control-regex:0 */
  let metaKeyCodeRe = /^(?:\x1b)([a-zA-Z0-9])$/;
  let fnKeyCodeRe = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;

  let match;
  let key = {
    name: void 0,
    ctrl: false,
    meta: false,
    shift: false,
    sequence: s,
    raw: s,
    ...event
  };

  if (Buffer.isBuffer(s)) {
    if (s[0] > 127 && s[1] === void 0) {
      s[0] -= 128;
      s = '\x1b' + String(s);
    } else {
      s = String(s);
    }
  } else if (s !== void 0 && typeof s !== 'string') {
    s = String(s);
  } else if (!s) {
    s = key.sequence || '';
  }

  if (s === '\r') {
    // carriage return
    key.name = 'return';
  } else if (s === '\n') {
    // enter, should have been called linefeed
    key.name = 'enter';
  } else if (s === '\t') {
    // tab
    key.name = 'tab';
  } else if (s === '\b' || s === '\x7f' || s === '\x1b\x7f' || s === '\x1b\b') {
    // backspace or ctrl+h
    key.name = 'backspace';
    key.meta = s.charAt(0) === '\x1b';
  } else if (s === '\x1b' || s === '\x1b\x1b') {
    // escape key
    key.name = 'escape';
    key.meta = s.length === 2;
  } else if (s === ' ' || s === '\x1b ') {
    // space
    key.name = 'space';
    key.meta = s.length === 2;
  } else if (s <= '\x1a') {
    // ctrl+letter
    key.name = String.fromCharCode(s.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
    key.ctrl = true;
  } else if (s.length === 1 && s >= '0' && s <= '9') {
    // number
    key.raw = s;
    key.name = 'number';
  } else if (s.length === 1 && s >= 'a' && s <= 'z') {
    // lowercase letter
    key.name = s;
  } else if (s.length === 1 && s >= 'A' && s <= 'Z') {
    // shift+letter
    key.name = s.toLowerCase();
    key.shift = true;
  } else if ((match = metaKeyCodeRe.exec(s))) {
    // meta+character key
    key.name = match[1].toLowerCase();
    key.meta = true;
    key.shift = /^[A-Z]$/.test(match[1]);
  } else if ((match = fnKeyCodeRe.exec(s))) {
    // ansi escape sequence
    // reassemble the key code leaving out leading \x1b's,
    // the modifier key bitflag and any meaningless "1;" sequence
    let code = [match[1], match[2], match[4], match[6]].filter(Boolean).join('');
    let modifier = (match[3] || match[5] || 1) - 1;

    // Parse the key modifier
    key.ctrl = !!(modifier & 4);
    key.meta = !!(modifier & 10);
    key.shift = !!(modifier & 1);
    key.code = code;

    // Parse the key itself
    parseKey(key, code);
  }

  return key;
};

// XXX: this "mouse" parsing code is NOT part of the node-core standard
// `readline.js` module, and is a `keypress` module non-standard extension.
const parseMousepress = (s, key) => {
  if (key.code !== '[M') return key;
  key.name = 'mouse';
  s = key.sequence;
  let b = s.charCodeAt(3);
  key.x = s.charCodeAt(4) - parseInt('040', 8);
  key.y = s.charCodeAt(5) - parseInt('040', 8);

  key.scroll = 0;

  key.ctrl = !!((1 << 4) & b);
  key.meta = !!((1 << 3) & b);
  key.shift = !!((1 << 2) & b);

  key.release = (3 & b) === 3;

  // scroll
  if ((1 << 6) & b) {
    key.scroll = 1 & b ? 1 : -1;
  }

  if (!key.release && !key.scroll) {
    key.button = b & 3;
  }
  return key;
};

/**
 * Listen for keypress events on the given input `stream`
 * @param {Stream} `stream` Input stream, e.g. `process.stdin`
 * @param {Function} `cb`
 */

const listen = (stream, onKeypress) => {
  if (!stream || typeof stream.isRaw !== 'boolean') {
    throw new Error('Invalid stream passed');
  }

  let onData = buf => onKeypress(String(buf), parseKeypress(String(buf)));
  let isRaw = stream.isRaw;
  stream.setRawMode(true);
  stream.on('data', onData);
  stream.resume();

  let off = () => {
    stream.setRawMode(isRaw);
    stream.pause();
    stream.removeListener('data', onData);
  };

  return off;
};

parseKeypress.parseMousepress = parseMousepress;
parseKeypress.listen = listen;
module.exports = parseKeypress;
