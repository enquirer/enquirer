const enquirer = require('../..');

enquirer.text({ message: 'Name?' })
  .then(answer => console.log('name:', answer))
  .catch(console.error);
