const { prompt } = require('..');

prompt(require('./questions'))
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
