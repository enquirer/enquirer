'use strict';

const colors = require('ansi-colors');
const { Rating } = require('enquirer');
const styles = [colors.blue, colors.cyan, colors.green, colors.yellow, colors.red];
const hint = (state, choice) => {
  switch (choice.idx) {
    case 5: return ' ' + styles[choice.idx - 1]('Love it!');
    case 4: return ' ' + styles[choice.idx - 1]('It\'s pretty good!');
    case 3: return ' ' + styles[choice.idx - 1]('It\'s okay.');
    case 2: return ' ' + styles[choice.idx - 1]('Not impressed.');
    case 1: return ' ' + styles[choice.idx - 1]('It sucks!');
  }
};

const prompt = new Rating({
  name: 'experience',
  message: 'Please rate your experience',
  margin: [1, 1, 1, 1],
  styles: { primary: colors.blue },
  symbol(state, choice, i, j) {
    return styles[j](colors.symbols.heart);
  },
  choices: [
    { hint, name: 'shipping', message: '1. Shipping', initial: 3 },
    { hint, name: 'price', message: '2. Price', initial: 3 },
    { hint, name: 'quality', message: '3. Quality', initial: 3 },
    { hint, name: 'communication', message: '4. Communication', initial: 3 },
    { hint, name: 'experience', message: '5. Overall Experience', initial: 3 }
  ]
});

prompt.run()
  .then(value => console.log(value))
  .catch(console.error);
