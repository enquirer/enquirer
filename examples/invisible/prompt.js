const Prompt = require('../../lib/prompts/invisible');
const prompt = new Prompt({
  name: 'secret',
  message: 'What is your secret?'
});

prompt.run()
  .then(answer => console.log('Answer:', [answer]))
  .catch(console.error);
