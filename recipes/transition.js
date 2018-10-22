const { prompt } = require('..');
let number = 1;

prompt([
  { type: 'transition' },
  {
    type: 'input',
    name: 'name',
    message: 'what is your name?',
    prefix(state) {
      return state.submitted ? number++ : number;
    }
  },
  { type: 'transition' },
  {
    type: 'input',
    name: 'username',
    message: 'what is your username?',
    prefix(state) {
      return state.submitted ? number++ : number;
    }
  }
])
  .then(answer => console.log('ANSWER:', answer))
  .catch(console.error);
