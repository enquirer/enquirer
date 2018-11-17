'use strict';

const colors = require('ansi-colors');
const { Input } = require('enquirer');
const prompt = new Input({
  message: 'What is your username?',
  initial: 'jonschlinkert',
  symbols: { prefix: '$' },
  styles: {
    primary: colors.yellow,
    get submitted() {
      return this.complementary(this.primary);
    }
  }
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log);
