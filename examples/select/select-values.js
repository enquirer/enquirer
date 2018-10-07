const Prompt = require('../../lib/prompts/select');
const prompt = new Prompt({
  name: 'color',
  message: 'Pick a color',
  choices: [
    { message: 'Red', value: '#ff0000' },
    { message: 'Green', value: '#00ff00' },
    { message: 'Blue', value: '#0000ff' }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
