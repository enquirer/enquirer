const colors = require('ansi-colors');
const spinners = require('cli-spinners');
const Prompt = require('../lib/prompts/multiselect');
const animate = require('./animate');

const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  hint: 'Thinking...',
  choices: ['Blue', 'Red', 'Green', 'Orange', 'Yellow']
});

const spinner = animate(prompt, 'separator', spinners.point);

prompt.once('run', () => spinner.start());
prompt.once('close', () => spinner.stop());
setTimeout(() => {
  spinner.stop();
  prompt.enable('Blue');
  prompt.enable('Orange');
  prompt.enable('Green');
  prompt.submit();
}, 3000);

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
