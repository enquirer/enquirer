const Prompt = require('../../lib/prompts/password');
const prompt = new Prompt({
  name: 'password',
  message: 'What is your password?',
  validate(value) {
    return (!value || value.length < 7) ? 'Password must be 7 or more chars' : true;
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
