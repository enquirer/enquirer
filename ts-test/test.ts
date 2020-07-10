import Enquirer from '..';

it.skip(`skipped because Class constructor Prompt cannot be invoked without 'new'`, () => {
  const instance = new Enquirer({}, { question1: '' })
  instance
    .register('custom1', Enquirer.Prompt)
    .register('custom2', () => Enquirer.Prompt)
    .register({
      custom1: Enquirer.Prompt,
      custom2: () => Enquirer.Prompt
    });
  instance
    .use(function () {
      this.register('', Enquirer.Prompt);
    })
    .use(enquirer => {
      enquirer.register('', Enquirer.Prompt);
    });
})

it.skip('skipped because these tests requires prompts', () => {
  new Enquirer();
  new Enquirer.Prompt({ name: 'test', type: 'text', message: '' });

  Enquirer
    .prompt({ name: 'test', type: 'text', message: '' })
    .then(answer => answer);
  Enquirer
    .prompt(() => ({ name: 'test', type: 'text', message: '' }))
    .then(answer => answer);
  Enquirer
    .prompt([
      { name: 'test', type: 'text', message: '' },
      () => ({ name: 'test', type: 'text', message: '' })
    ])
    .then(answer => answer);
  Enquirer
    .prompt({ name: 'question', type: 'text', message: '' })
    .then(answer => answer.question);

  const instance = new Enquirer({}, { question1: '' })

  instance
    .prompt({ name: 'test', type: 'text', message: '' })
    .then(answer => answer.question1);
  instance
    .prompt(() => ({ name: 'test', type: 'text', message: '' }))
    .then(answer => answer.question1);
  instance
    .prompt([
      { name: 'test', type: 'text', message: '' },
      () => ({ name: 'test', type: 'text', message: '' })
    ])
    .then(answer => answer.question1);

  class CustomPrompt extends Enquirer.Prompt {
    render() { }
  }
  const customPrompt = new CustomPrompt({ message: 'custom' });
  customPrompt.run().then(answer => answer);

  // Prompt options
  Enquirer.prompt({
    type: 'text',
    name: 'test',
    message: '',
  });
  Enquirer.prompt({
    type: 'text',
    name: 'test',
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
      return value || '';
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
    onSubmit(name: string, value: string, prompt: Enquirer.Prompt) {
      return true;
    }
  });
  Enquirer.prompt({
    name: 'test',
    type: 'text',
    message: '',
    async onSubmit(name: string, value: string, prompt: Enquirer.Prompt) {
      return true;
    }
  });
  Enquirer.prompt({
    name: 'test',
    type: 'text',
    message: '',
    onCancel(name: string, value: string, prompt: Enquirer.Prompt) {
      return true;
    }
  });
  Enquirer.prompt({
    name: 'test',
    type: 'text',
    message: '',
    async onCancel(name: string, value: string, prompt: Enquirer.Prompt) {
      return true;
    }
  });
  // Enquirer.prompt({
  //   name: 'test',
  //   type: 'text',
  //   message: '',
  //   stdin: process.stdin
  // });
  // Enquirer.prompt({
  //   name: 'test',
  //   type: 'text',
  //   message: '',
  //   stdout: process.stdout
  // });

})
