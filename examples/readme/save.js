const Store = require('data-store');
const store = new Store({ path: __dirname + '/answers.json' });
const { prompt } = require('../..');

(async() => {

  const response = await prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name?',
      initial: store.get('name')
    },
    {
      type: 'input',
      name: 'username',
      message: 'What is your username?',
      initial: store.get('username')
    },
    {
      type: 'multiselect',
      name: 'colors',
      message: 'Favorite colors?',
      initial: store.get('colors'),
      choices: [
        { name: 'blue', value: '#0000ff' },
        { name: 'red', value: '#ff0000' },
        { name: 'yellow', value: '#ffff00' }
      ]
    }
  ], (name, value, state) => {
    store.set(name, state.values || value);
  });

// console.log(response);
})();
