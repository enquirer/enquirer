const { prompt } = require('../../lib/prompts/text');
const answers = {};

prompt.on('submit', (answer, p) => (answers[p.name] = answer));

prompt({ name: 'name', message: 'What is your name?' })
  .then(answer => console.log('name:', answer))
  .then(() => prompt({ name: 'username', message: 'What is your username?' }))
  .then(answer => console.log('username:', answer))
  .then(() => prompt({ name: 'email', message: 'What is your email?' }))
  .then(answer => console.log('email:', answer))
  .then(() => console.log(answers))
  .catch(console.log);
