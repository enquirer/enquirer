const Prompt = require('../../lib/prompts/text');
const prompt = new Prompt({
  name: 'username',
  message: 'What is your GitHub username?',
  // snippets: require('./snippets.json').html.abbreviations
  snippets: {
    '!': 'html:5',
    foo: 'bar'
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
