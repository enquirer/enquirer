'use strict';

const colors = require('ansi-colors');
const { Sort } = require('enquirer');
const prompt = new Sort({
  name: 'colors',
  message: 'Sort the colors in order of preference',
  hint: 'Top is best, bottom is worst',
  numbered: true,
  choices: ['red', 'white', 'green', 'cyan', 'yellow'].map(n => ({
    name: n,
    message: colors[n](n)
  }))
});

prompt.run()
  .then(function(answer = []) {
    console.log(answer);
    console.log('Your preferred order of colors is:');
    console.log(answer.map(key => colors[key](key)).join('\n'));
  })
  .catch(console.error);
