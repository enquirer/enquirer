const enquirer = require('../..');

enquirer.on('submit', answer => console.log(answer));
enquirer.on('error', err => console.log(err));

enquirer.text({
  name: 'username',
  message: 'What is your username?'
});
