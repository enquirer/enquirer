const Prompt = require('../../lib/prompts/multiselect');
const yosay = require('yosay');
const prompt = new Prompt({
  type: 'multiselect',
  name: 'value',
  message: 'Pick your favorite colors',
  header: yosay('Welcome to my awesome generator!'),
  footer: 'This is a footer\nwith a\nfew\nextra\nlines',
  hint: '(Use <space> to select, <return> to submit)',
  initial: 'jonschlinkert',
  limit: 7,
  choices: [
    { name: 'aqua', value: '#00ffff' },
    { name: 'black', value: '#000000' },
    { name: 'blue', value: '#0000ff', hint: '(this is a choice hint)' },
    { name: 'fuchsia', value: '#ff00ff' },
    { name: 'gray', value: '#808080' },
    { name: 'green', value: '#008000' },
    { name: 'lime', value: '#00ff00' },
    { name: 'maroon', value: '#800000' },
    { name: 'navy', value: '#000080' },
    { name: 'olive', value: '#808000' },
    { name: 'purple', value: '#800080' },
    { name: 'red', value: '#ff0000' },
    { name: 'silver', value: '#c0c0c0' },
    { name: 'teal', value: '#008080' },
    { name: 'white', value: '#ffffff' },
    { name: 'yellow', value: '#ffff00' }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
