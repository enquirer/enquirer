const { prompt } = require('../checkbox');

prompt({ message: 'Favorite color?', choices: ['red', 'blue', 'green'] })
  .on('submit', answer => console.log(answer))
  .on('cancel', error => console.log(error));
