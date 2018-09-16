const { red, dim, blue } = require('ansi-colors');
const Prompt = require('../../lib/prompts/multiselect');
const heart = '❤';

const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  choices: { foo: ['a', 'b', 'c'], bar: ['d', 'e', 'f'] },
  indicator(choice, i) {
    if (choice.enabled && ['d', 'e', 'f', 'bar'].includes(choice.name)) {
      return blue(heart);
    }
    return choice.enabled ? red(heart) : dim.gray(heart);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
