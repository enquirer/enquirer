const Enquirer = require('..');
const enquirer = new Enquirer();

enquirer.prompt(require('./questions'))
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
