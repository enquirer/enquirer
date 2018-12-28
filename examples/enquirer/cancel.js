'use strict';

const { prompt } = require('enquirer');

(async() => {
  let questions = [
    {
      type: 'input',
      name: 'foo',
      onRun() {
        this.cancel('cancelled');
      }
    },
    {
      type: 'input',
      name: 'bar'
    },
    {
      type: 'input',
      name: 'baz'
    }
  ];

  for (let question of questions) {
    await prompt(question);
  }

})().then(console.log).catch(console.log);
