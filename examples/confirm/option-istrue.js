const { Confirm } = require('enquirer');

const prompt = new Confirm({
  name: 'apples',
  message: 'How to you like these apples?',
  default: '(t/F)',
  onRun() {
    this.isTrue = value => value === 't';
    this.isFalse = value => value === 'f';
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
