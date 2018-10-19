const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/select');

const prompt = new Prompt({
  name: 'color',
  message: 'Pick a flavor',
  choices: ['apple', 'grape', 'watermelon', 'cherry', 'orange'],
  pointer(state, choice, i) {
    return state.index === i ? colors.green('→') : ' ';
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(err => console.error('TERMINATED'));
