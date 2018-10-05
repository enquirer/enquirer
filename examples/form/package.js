const package = require('../../package');
const choices = [];

for (let name of Object.keys(package)) {
  let initial = package[name];
  if (initial && !Array.isArray(initial) && typeof initial !== 'object') {
    choices.push({ name, initial });
  }
}

const Prompt = require('../../lib/prompts/form');
const prompt = new Prompt({
  name: 'user',
  message: 'Please provide the following information:',
  choices
});

prompt.run()
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
