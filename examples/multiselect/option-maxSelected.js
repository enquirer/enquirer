'use strict';

const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'alphabet',
  message: 'Favorite color?',
  choices: ['Blue', 'Green', 'Orange', 'Red', 'Violet'],
  maxSelected: 3,
  format() {
    let n = this.maxSelected - this.selected.length;
    let s = (n === 0 || n > 1) ? 's' : '';
    return `You may select ${n} more choice${s}`;
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
