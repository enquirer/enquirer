let memo = new Map();
let keys = [
  {
    name: '_',
    ctrl: false,
    meta: false,
    shift: true,
    value: '_',
    sequence: '_'
  },
  {
    name: '-',
    ctrl: false,
    meta: false,
    shift: false,
    value: '-',
    sequence: '-'
  },
  {
    name: ',',
    ctrl: false,
    meta: false,
    shift: false,
    value: ',',
    sequence: ','
  },
  {
    name: ',',
    ctrl: false,
    meta: false,
    shift: false,
    value: ',',
    sequence: ','
  },
  {
    name: ';',
    ctrl: false,
    meta: false,
    shift: false,
    value: ';',
    sequence: ';'
  },
  {
    name: ';',
    ctrl: false,
    meta: false,
    shift: false,
    value: ';',
    sequence: ';'
  },
  {
    name: ';',
    ctrl: false,
    meta: false,
    shift: false,
    value: ';',
    sequence: ';'
  },
  {
    name: ':',
    ctrl: false,
    meta: false,
    shift: true,
    value: ':',
    sequence: ':'
  },
  {
    name: '!',
    ctrl: false,
    meta: false,
    shift: true,
    value: '!',
    sequence: '!'
  },
  {
    name: '?',
    ctrl: false,
    meta: false,
    shift: true,
    value: '?',
    sequence: '?'
  },
  {
    name: '"',
    ctrl: false,
    meta: false,
    shift: true,
    value: '"',
    sequence: '"'
  },
  {
    name: '(',
    ctrl: false,
    meta: false,
    shift: true,
    value: '(',
    sequence: '('
  },
  {
    name: ')',
    ctrl: false,
    meta: false,
    shift: true,
    value: ')',
    sequence: ')'
  },
  {
    name: '[',
    ctrl: false,
    meta: false,
    shift: false,
    value: '[',
    sequence: '['
  },
  {
    name: ']',
    ctrl: false,
    meta: false,
    shift: false,
    value: ']',
    sequence: ']'
  },
  {
    name: '{',
    ctrl: false,
    meta: false,
    shift: true,
    value: '{',
    sequence: '{'
  },
  {
    name: '}',
    ctrl: false,
    meta: false,
    shift: true,
    value: '}',
    sequence: '}'
  },
  {
    name: '@',
    ctrl: false,
    meta: false,
    shift: true,
    value: '@',
    sequence: '@'
  },
  {
    name: '*',
    ctrl: false,
    meta: false,
    shift: true,
    value: '*',
    sequence: '*'
  },
  {
    name: '/',
    ctrl: false,
    meta: false,
    shift: false,
    value: '/',
    sequence: '/'
  },
  {
    name: '\\',
    ctrl: false,
    meta: false,
    shift: false,
    value: '\\',
    sequence: '\\'
  },
  {
    name: '&',
    ctrl: false,
    meta: false,
    shift: true,
    value: '&',
    sequence: '&'
  },
  {
    name: '#',
    ctrl: false,
    meta: false,
    shift: true,
    value: '#',
    sequence: '#'
  },
  {
    name: '%',
    ctrl: false,
    meta: false,
    shift: true,
    value: '%',
    sequence: '%'
  },
  {
    name: '`',
    ctrl: false,
    meta: false,
    shift: false,
    value: '`',
    sequence: '`'
  },
  {
    name: '`',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0000',
    sequence: '\u0000'
  },
  {
    name: '^',
    ctrl: false,
    meta: false,
    shift: true,
    value: '^',
    sequence: '^'
  },
  {
    name: '+',
    ctrl: false,
    meta: false,
    shift: true,
    value: '+',
    sequence: '+'
  },
  {
    name: '<',
    ctrl: false,
    meta: false,
    shift: true,
    value: '<',
    sequence: '<'
  },
  {
    name: '=',
    ctrl: false,
    meta: false,
    shift: false,
    value: '=',
    sequence: '='
  },
  {
    name: '=',
    ctrl: false,
    meta: false,
    shift: false,
    value: '=',
    sequence: '='
  },
  {
    name: '=',
    ctrl: false,
    meta: false,
    shift: false,
    value: '=',
    sequence: '='
  },
  {
    name: '>',
    ctrl: false,
    meta: false,
    shift: true,
    value: '>',
    sequence: '>'
  },
  {
    name: '|',
    ctrl: false,
    meta: false,
    shift: true,
    value: '|',
    sequence: '|'
  },
  {
    name: '~',
    ctrl: false,
    meta: false,
    shift: true,
    value: '~',
    sequence: '~'
  },
  {
    name: '$',
    ctrl: false,
    meta: false,
    shift: true,
    value: '$',
    sequence: '$'
  },
  {
    name: 'a',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0001',
    sequence: '\u0001'
  },
  {
    name: 'a',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'A',
    sequence: 'A'
  },
  {
    name: 'a',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'a',
    sequence: 'a'
  },
  {
    name: 'b',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0002',
    sequence: '\u0002'
  },
  {
    name: 'b',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'B',
    sequence: 'B'
  },
  {
    name: 'b',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'b',
    sequence: 'b'
  },
  {
    name: 'backspace',
    ctrl: false,
    meta: false,
    shift: false,
    value: '',
    sequence: ''
  },
  {
    name: 'backspace',
    ctrl: false,
    meta: false,
    shift: false,
    value: '',
    sequence: ''
  },
  {
    name: 'backspace',
    ctrl: false,
    meta: false,
    shift: false,
    value: '',
    sequence: ''
  },
  {
    name: 'backspace',
    ctrl: false,
    meta: false,
    shift: false,
    value: '\b',
    sequence: '\b'
  },
  {
    name: 'c',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'c',
    sequence: 'c'
  },
  {
    name: 'c',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0003',
    sequence: '\u0003'
  },
  {
    name: 'c',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0003',
    sequence: '\u0003'
  },
  {
    name: 'c',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'C',
    sequence: 'C'
  },
  {
    name: 'd',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'd',
    sequence: 'd'
  },
  {
    name: 'd',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0004',
    sequence: '\u0004'
  },
  {
    name: 'd',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'D',
    sequence: 'D'
  },
  {
    name: 'down',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u000e',
    sequence: '\u000e'
  },
  {
    name: 'e',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'E',
    sequence: 'E'
  },
  {
    name: 'e',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0005',
    sequence: '\u0005'
  },
  {
    name: 'e',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'e',
    sequence: 'e'
  },
  {
    name: 'enter',
    ctrl: false,
    meta: false,
    shift: false,
    value: '\n',
    sequence: '\n'
  },
  {
    name: 'escape',
    ctrl: false,
    meta: false,
    shift: false,
    value: '\u001b',
    sequence: '\u001b'
  },
  {
    name: 'escape',
    ctrl: false,
    meta: false,
    shift: false,
    value: '\u001b',
    sequence: '\u001b'
  },
  {
    name: 'f',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'F',
    sequence: 'F'
  },
  {
    name: 'f',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0006',
    sequence: '\u0006'
  },
  {
    name: 'f',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'f',
    sequence: 'f'
  },
  {
    name: 'g',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'G',
    sequence: 'G'
  },
  {
    name: 'g',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0007',
    sequence: '\u0007'
  },
  {
    name: 'g',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'g',
    sequence: 'g'
  },
  {
    name: 'h',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'H',
    sequence: 'H'
  },
  {
    name: 'h',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'h',
    sequence: 'h'
  },
  {
    name: 'i',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'I',
    sequence: 'I'
  },
  {
    name: 'i',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'i',
    sequence: 'i'
  },
  {
    name: 'j',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'J',
    sequence: 'J'
  },
  {
    name: 'j',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'j',
    sequence: 'j'
  },
  {
    name: 'k',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'K',
    sequence: 'K'
  },
  {
    name: 'k',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'k',
    sequence: 'k'
  },
  {
    name: 'k',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u000b',
    sequence: '\u000b'
  },
  {
    name: 'l',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'L',
    sequence: 'L'
  },
  {
    name: 'l',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'l',
    sequence: 'l'
  },
  {
    name: 'l',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\f',
    sequence: '\f'
  },
  {
    name: 'm',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'M',
    sequence: 'M'
  },
  {
    name: 'm',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'm',
    sequence: 'm'
  },
  {
    name: 'n',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'n',
    sequence: 'n'
  },
  {
    name: 'n',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'N',
    sequence: 'N'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 9,
    sequence: '9'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 0,
    sequence: '0'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 1,
    sequence: '1'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 1,
    sequence: '1'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 0,
    sequence: '0'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 3,
    sequence: '3'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 4,
    sequence: '4'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 5,
    sequence: '5'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 6,
    sequence: '6'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 7,
    sequence: '7'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 8,
    sequence: '8'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 9,
    sequence: '9'
  },
  {
    name: 'number',
    ctrl: false,
    meta: false,
    shift: false,
    value: 2,
    sequence: '2'
  },
  {
    name: 'o',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'O',
    sequence: 'O'
  },
  {
    name: 'o',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'o',
    sequence: 'o'
  },
  {
    name: 'o',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u000f',
    sequence: '\u000f'
  },
  {
    name: 'p',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'P',
    sequence: 'P'
  },
  {
    name: 'p',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'p',
    sequence: 'p'
  },
  {
    name: 'q',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'Q',
    sequence: 'Q'
  },
  {
    name: 'q',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'q',
    sequence: 'q'
  },
  {
    name: 'q',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0011',
    sequence: '\u0011'
  },
  {
    name: 'r',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'r',
    sequence: 'r'
  },
  {
    name: 'r',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0012',
    sequence: '\u0012'
  },
  {
    name: 'r',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'R',
    sequence: 'R'
  },
  {
    name: 'return',
    ctrl: false,
    meta: false,
    shift: false,
    value: '\r',
    sequence: '\r'
  },
  {
    name: 'return',
    ctrl: false,
    meta: false,
    shift: false,
    value: '\r',
    sequence: '\r'
  },
  {
    name: 's',
    ctrl: false,
    meta: false,
    shift: false,
    value: 's',
    sequence: 's'
  },
  {
    name: 's',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0013',
    sequence: '\u0013'
  },
  {
    name: 's',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'S',
    sequence: 'S'
  },
  {
    name: 't',
    ctrl: false,
    meta: false,
    shift: false,
    value: 't',
    sequence: 't'
  },
  {
    name: 't',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0014',
    sequence: '\u0014'
  },
  {
    name: 't',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'T',
    sequence: 'T'
  },
  {
    name: 'tab',
    ctrl: false,
    meta: false,
    shift: false,
    value: '\t',
    sequence: '\t'
  },
  {
    name: 'tab',
    ctrl: false,
    meta: false,
    shift: true,
    value: '\u001b[Z',
    sequence: '\u001b[Z',
    code: '[Z'
  },
  {
    name: 'tab',
    ctrl: false,
    meta: false,
    shift: false,
    value: '\t',
    sequence: '\t'
  },
  {
    name: 'u',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0015',
    sequence: '\u0015'
  },
  {
    name: 'u',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'U',
    sequence: 'U'
  },
  {
    name: 'u',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'u',
    sequence: 'u'
  },
  {
    name: 'up',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0010',
    sequence: '\u0010'
  },
  {
    name: 'v',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0016',
    sequence: '\u0016'
  },
  {
    name: 'v',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'v',
    sequence: 'v'
  },
  {
    name: 'v',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'V',
    sequence: 'V'
  },
  {
    name: 'w',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0017',
    sequence: '\u0017'
  },
  {
    name: 'w',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'W',
    sequence: 'W'
  },
  {
    name: 'w',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'w',
    sequence: 'w'
  },
  {
    name: 'x',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'x',
    sequence: 'x'
  },
  {
    name: 'x',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'X',
    sequence: 'X'
  },
  {
    name: 'x',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0018',
    sequence: '\u0018'
  },
  {
    name: 'y',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'y',
    sequence: 'y'
  },
  {
    name: 'y',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u0019',
    sequence: '\u0019'
  },
  {
    name: 'y',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'Y',
    sequence: 'Y'
  },
  {
    name: 'z',
    ctrl: false,
    meta: false,
    shift: false,
    value: 'z',
    sequence: 'z'
  },
  {
    name: 'z',
    ctrl: false,
    meta: false,
    shift: true,
    value: 'Z',
    sequence: 'Z'
  },
  {
    name: 'z',
    ctrl: true,
    meta: false,
    shift: false,
    value: '\u001a',
    sequence: '\u001a'
  },
  {
    name: 'up',
    ctrl: false,
    meta: false,
    shift: true,
    value: '\u001b[1;2A',
    sequence: '\u001b[1;2A',
    code: '[A'
  },
  {
    name: 'down',
    ctrl: false,
    meta: false,
    shift: true,
    value: '\u001b[1;2B',
    sequence: '\u001b[1;2B',
    code: '[B'
  },
  {
    name: 'left',
    ctrl: false,
    meta: false,
    shift: true,
    value: '\u001b[1;2D',
    sequence: '\u001b[1;2D',
    code: '[D'
  },
  {
    name: 'right',
    ctrl: false,
    meta: false,
    shift: true,
    value: '\u001b[1;2C',
    sequence: '\u001b[1;2C',
    code: '[C'
  }
];

const fs = require('fs');

keys.sort((a, b) => a.name.localeCompare(b.name));

for (let i = 0; i < keys.length; i++) {
  let key = keys[i];
  let str = '';
  if (key.ctrl) str += 'ctrl+';
  if (key.shift) str += 'shift+';
  str += /^\w+/.test(key.value) ? String(key.value).toLowerCase() : key.name;
  key.press = str;
}

const sorted = keys.sort((a, b) => a.press.localeCompare(b.press));
const res = {};

for (const k of sorted) {
  if (memo.has(k.press)) continue;
  if (!k.ctrl && !k.shift) continue;
  memo.set(k.press, k);
  res[k.press] = k;
}

// run prettier on result after writing it to keys.js
fs.writeFileSync('keys.js', 'module.exports = ' + JSON.stringify(res, null, 2));
