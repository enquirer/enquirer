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
const customPrompt = new CustomPrompt()
customPrompt.run().then(answer => answer)
