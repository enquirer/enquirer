const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  choices: {
    local: ['scaffolds', 'package'],
    global: ['npm', 'git'],
    other: [],
    default: { message: 'Default generator' }
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
