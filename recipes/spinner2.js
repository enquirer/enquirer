const colors = require('ansi-colors');
const spinners = require('cli-spinners');
const Prompt = require('../lib/prompts/multiselect');
const animate = require('./animate');

const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  hint: 'Thinking...',
  choices: ['Foo', 'Bar', 'Baz']
});

const spinner = animate(prompt, 'separator', spinners.point);

prompt.once('run', () => spinner.start());
prompt.once('close', () => spinner.stop());

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
