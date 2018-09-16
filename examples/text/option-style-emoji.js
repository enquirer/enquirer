const Prompt = require('../../lib/prompts/text');
const prompt = new Prompt({
  name: 'username',
  message: 'What is your GitHub username?',
  style: 'emoji'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
