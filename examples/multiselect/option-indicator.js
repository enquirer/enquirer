const Prompt = require('../../lib/prompts/multiselect');
const colors = require('ansi-colors');

const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite letters?',
  choices: ['a', 'b', 'c', 'd', 'e', 'f'],
  styles: { primary: colors.red },
  symbols: { indicator: '❤' },
  indicator(choice) {
    if (choice.enabled) {
      return this.styles.primary(this.symbols.indicator);
    }
    return colors.dim.gray(this.symbols.indicator);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
