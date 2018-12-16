const { Confirm } = require('enquirer');

const prompt = new Confirm({
  name: 'apples',
  message: 'How do you like these apples?',
  onRun() {
    this.isTrue = value => value === 'f';
    this.isFalse = value => value === 't';
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
