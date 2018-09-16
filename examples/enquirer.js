const Enquirer = require('..');
const enquirer = new Enquirer();

enquirer.prompt(require('./_questions'))
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
