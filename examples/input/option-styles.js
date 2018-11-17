'use strict';

const { Input } = require('enquirer');
const colors = require('ansi-colors');
const prompt = new Input({
  message: 'What is your username?',
  initial: 'jonschlinkert',
  styles: {
    primary: colors.blue,
    get submitted() {
      return this.complement;
    }
  }
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log);
