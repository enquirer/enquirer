'use strict';

const { Quiz } = require('enquirer');

const prompt = new Quiz({
  name: 'countries',
  message: 'How many countries are there in the world?',
  choices: ['165', '175', '185', '195', '205'],
  correctChoice: 3
});

prompt
  .run()
  .then(answer => {
    if (answer.selected) {
      console.log('Correct!');
    } else {
      console.log(`Wrong! Correct answer is ${answer.correct}`);
    }
  })
  .catch(console.error);
