const Prompt = require('../../lib/prompts/password');
const prompt = new Prompt({
  name: 'password',
  message: 'What is your password?',
  validate(value = '') {
    return value.length > 7;
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
