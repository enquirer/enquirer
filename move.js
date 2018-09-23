
// const fs = require('fs');
// const path = require('path');
// const license = fs.readFileSync(path.join(__dirname, '../../LICENSE'), 'utf8');
// const write = str => process.stdout.write(str);
// const ESC = '\u001b';

// const up = (n = 1) => `${ESC}[${n}A`;
// const down = (n = 1) => `${ESC}[${n}B`;
// const right = (n = 1) => `${ESC}[${n}C`;
// const left = (n = 1) => `${ESC}[${n}D`;
// const move = (x, y) => {
//   let out = '';
//   out += (x < 0) ? left(-x) : (x > 0) ? right(x) : '';
//   out += (y < 0) ? up(-y) : (y > 0) ? down(y) : '';
//   return out;
// };

// write('Foo bar baz quz fez');
// // write(left())
// // write(left())
// // write('\n');
// // write(left())
// // write(move(1, 1));

let cursor = 6;
let val = 'foo bar baz';

console.log(-val.length + cursor)
