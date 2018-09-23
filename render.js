const spinner = require('/Users/jonschlinkert/dev/@sellside/spinner/index.js');
const timeout = (fn, ms = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => fn().then(resolve).catch(reject), ms);
  });
};

const grid = [
  ['HEADER'],
  [spinner('', { timeout: 1000 })],
  [spinner('', { timeout: 1000 })],
  [spinner('', { timeout: 1000 })],
  [spinner('', { timeout: 1000 })],
  ['FOOTER']
];

const render = async (grid) => {
  let rows = [];
  for await (let row of grid) {
    let cols = [];

    for await (let col of row) cols.push(col);
    rows.push(cols.join(' '));
  }

  return rows.join('\n');
};

render(grid).catch(console.error);
