const { prompt } = require('../../lib/prompts/text');
const answers = {};

prompt.on('submit', (value, prompt) => (answers[prompt.name] = value));

const keys = ['name', 'username', 'email'];
const run = (key, initial) => {
  return prompt({ name: key, message: `What is your ${key}?`, initial });
};

Promise.resolve()
  .then(() => run(keys.shift()))
  .then(() => run(keys.shift()))
  .then(() => run(keys.shift()))
  .then(() => console.log(answers))
  .catch(console.error);
