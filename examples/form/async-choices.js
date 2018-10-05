const path = require('path');
const ansi = require('../../lib/style/ansi');
const Input = require('../../lib/prompts/input');
const Prompt = require('../../lib/prompts/form');

const input = (name, message, initial) => {
  return prompt => {
    let p = new Input({ name, message, initial, clear: true });
    p.on('close', () => p.write(ansi.erase.lines(2)));
    return p.run().then(value => ({ name, message, value }));
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
      prefix: 'https://github.com/',
      get initial() {
        return prompt.values.username + '/' + prompt.values.name;
      }
    }
  ]
});

prompt.run()
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
