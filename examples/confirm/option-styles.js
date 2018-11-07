const colors = require('ansi-colors');
const { prompt } = require('../../lib/prompts/confirm');

prompt({ message: 'Want to answer?', styles: { primary: colors.blue } })
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
