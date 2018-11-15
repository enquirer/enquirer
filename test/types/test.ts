import Enquirer = require('../../');

new Enquirer();
new Enquirer.Prompt();
new Enquirer.Prompt({ name: 'test', type: 'text', message: '' });

Enquirer
  .prompt({ name: 'test', type: 'text', message: '' })
  .then(answer => answer);
Enquirer
  .prompt([{ name: 'test', type: 'text', message: '' }])
  .then(answer => answer);
Enquirer
  .prompt<{ question: string }>({ name: 'question', type: 'text', message: '' })
  .then(answer => answer.question);

const instance = new Enquirer({}, { question1: '' })
instance
  .register('custom1', Enquirer.Prompt)
  .register('custom2', () => Enquirer.Prompt)
  .register({
    custom1: Enquirer.Prompt,
    custom2: () => Enquirer.Prompt
  });
instance
  .prompt({ name: 'test', type: 'text', message: '' })
  .then(answer => answer.question1);
instance
  .prompt([{ name: 'test', type: 'text', message: '' }])
  .then(answer => answer.question1);
instance
  .use(function () {
    this.register('', Enquirer.Prompt);
  })
  .use(enquirer => {
    enquirer.register('', Enquirer.Prompt);
  });

class CustomPrompt extends Enquirer.Prompt {
  render() {}
}
const customPrompt = new CustomPrompt();
customPrompt.run().then(answer => answer);

// Prompt options
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  format() {
    return '';
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  async format() {
    return '';
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  format(value) {
    return value;
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  result() {
    return '';
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  async result() {
    return '';
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  result(value) {
    return value;
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  skip: true
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  async skip() {
    return true;
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  skip(state) {
    return !!state;
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  validate() {
    return true;
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  async validate() {
    return true;
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  validate(value) {
    return value;
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  async validate(value) {
    return value;
  }
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  stdin: process.stdin
});
Enquirer.prompt({
  name: 'test',
  type: 'text',
  message: '',
  stdout: process.stdout
});
