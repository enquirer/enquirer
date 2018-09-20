const colors = require('ansi-colors');
const enquirer = require('../..');

const prefix = function() {
  let color = this.state.answered ? 'green' : this.state.cancelled ? 'red' : 'blue';
  return colors[color](this.symbols.heart) + ' ';
};

enquirer.text({ message: 'Name?', prefix })
  .then(answer => console.log('name:', answer))
  .catch(console.error);
