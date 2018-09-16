const enquirer = require('../..');

const separator = function() {
  return this.answered ? this.symbols.check : this.symbols.ellipsis;
};

enquirer.text({ message: 'Name?', separator })
  .then(answer => console.log('name:', answer))
  .catch(console.error);
