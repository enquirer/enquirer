const enquirer = require('../..');

const prefix = function() {
  return this.symbols.heart;
};

enquirer.text({ message: 'Name?', prefix })
  .then(answer => console.log('name:', answer))
  .catch(console.error);
