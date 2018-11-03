const path = require('path');
const ansi = require('../../lib/ansi');
const Input = require('../../lib/prompts/input');
const Prompt = require('../../lib/prompts/form');

const input = (name, message, initial) => {
  return prompt => {
    let p = new Input({ name, message, initial });
    return p.run().then(value => ({ name, message, initial: value, value }));
  };
};

const prompt = new Prompt({
  name: 'user',
  message: 'Please review your answers:',
  choices: [
    input('name', 'Project name', path.basename(process.cwd())),
    input('author', 'Author name', 'jonschlinkert'),
    input('username', 'GitHub username/org', 'enquirer'),
    {
      name: 'repo',
      message: 'Repository URL',
      onChoice(state, choice, i) {
        let { name, username } = this.values;
        choice.initial = `https://github.com/${username}/${name}`;
      }
    }
  ]
});

prompt.run()
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
