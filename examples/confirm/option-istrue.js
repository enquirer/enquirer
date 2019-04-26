const { Confirm } = require('enquirer');

const prompt = new Confirm({
  name: 'apples',
  message: 'Do you like apples?',
  default: '(t/F)',
  onRun() {
    this.isTrue = value => value === 'f';
    this.isFalse = value => value === 't';
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
