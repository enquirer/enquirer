const { BasicAuth } = require('enquirer');

const prompt = new BasicAuth({
  name: 'password',
  message: 'Please enter your password',
  username: 'rajat-sr',
  password: '123',
  showPassword: true
});

prompt
  .run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
