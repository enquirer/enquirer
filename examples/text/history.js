const Prompt = require('../../lib/prompts/text');
const prompt = new Prompt({
  name: 'owner',
  message: 'Project owner?',
  initial: 'jonschlinkert',
  history: {
    path: `${__dirname}/text-history_owner.json`,
    autosave: true,
    state: {
      past: ['doowb', 'jonschlinkert', 'foo'],
      present: ''
    }
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
