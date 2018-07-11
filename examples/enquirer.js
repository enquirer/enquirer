const Enquirer = require('..');
const enquirer = new Enquirer();

enquirer.register('radio', require('../recipes/radio'));
enquirer.register('snippet', require('../recipes/snippet'));
enquirer.register('form', require('../recipes/form'));

enquirer.prompt(require('./questions'))
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
