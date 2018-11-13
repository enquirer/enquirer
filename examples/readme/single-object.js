const { prompt } = require('../..');

(async() => {

  const response = await prompt({
    type: 'input',
    name: 'username',
    message: 'What is your username?'
  });

  console.log(response.username);
//=> 'jonschlinkert'
})();
