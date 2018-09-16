const { prompt } = require('../checkbox');
const { dim, red } = require('ansi-colors');

const indicator = function(choice) {
  return choice.enabled ? red(this.symbols.heart) : dim.gray(this.symbols.heart);
};

prompt({ message: 'Favorite color?', choices: ['red', 'blue', 'green'], indicator })
  .on('submit', answer => console.log(answer))
  .on('cancel', error => console.log(error));
