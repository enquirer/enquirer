const Prompt = require('../../lib/prompts/survey');
const prompt = new Prompt({
  name: 'experience',
  message: 'Please rate your experience',
  choices: [
    {
      name: 'interface',
      message: 'The website has a friendly interface.'
    },
    {
      name: 'navigation',
      message: 'The website is easy to navigate.'
    },
    {
      name: 'images',
      message: 'The website usually has good images.'
    },
    {
      name: 'upload',
      message: 'The website makes it easy to upload images.'
    },
    {
      name: 'colors',
      message: 'The website has a pleasing color palette.'
    }
  ]
});

prompt.run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
