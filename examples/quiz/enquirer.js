'use strict';

const { prompt } = require('enquirer');

prompt([
  {
    type: 'quiz',
    name: 'Total number of countries',
    message: 'How many countries are there in the world?',
    choices: ['165', '175', '185', '195', '205'],
    correctChoice: 3
  },
  {
    type: 'quiz',
    name: 'Second largest country',
    message: 'Which is the largest country in the world after Russia?',
    choices: ['USA', 'Canada', 'China', 'India'],
    correctChoice: 1
  }
])
  .then(answer => {
    console.log(answer);
  })
  .catch(console.error);
