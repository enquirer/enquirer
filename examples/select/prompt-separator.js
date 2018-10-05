const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/select');
const separator = () => ({ message: colors.dim('────'), disabled: true });
const prompt = new Prompt({
  name: 'separator-example',
  message: 'Pick your favorite color',
  choices: [
    'apple',
    'grape',
    separator(),
    'watermelon',
    'cherry',
    'strawberry',
    separator(),
    'lemon',
    'orange'
  ]
});

prompt
  .run()
  .then(answer => console.log('Answer:', answer === 'insult' ? 'You stink!' : answer))
  .catch(err => console.error('TERMINATED'));
