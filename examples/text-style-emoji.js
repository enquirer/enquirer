const Prompt = require('../prompts/text');
const prompt = new Prompt({
  name: 'username',
  message: 'What is your GitHub username?',
  initial: 'jonschlinkert',
  style: 'emoji'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
