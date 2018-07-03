const yosay = require('yosay');
const colors = require('ansi-colors');
const Prompt = require('../prompts/select');

const prompt = new Prompt({
  name: 'color',
  message: 'Pick a color',
  header: yosay('Welcome to my awesome generator!'),
  footer: colors.yellow('(Scroll up and down to reveal more choices)'),
  limit: 5,
  choices: [
    'aqua',
    'black',
    'blue',
    'fuchsia',
    'gray',
    'green',
    'lime',
    'maroon',
    'navy',
    'olive',
    'purple',
    'red',
    'silver',
    'teal',
    'white',
    'yellow'
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
