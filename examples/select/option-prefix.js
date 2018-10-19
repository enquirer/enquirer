const { symbols, cyan, red, yellow } = require('ansi-colors');
const Prompt = require('../../lib/prompts/select');

const prompt = new Prompt({
  name: 'color',
  message: 'Pick a flavor',
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange'],
  prefix(state) {
    let style = { pending: cyan, submitted: red, cancelled: yellow };
    return style[state.status](symbols.heart);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(err => console.error('TERMINATED'));
