const Prompt = require('../../lib/prompts/editable');
const prompt = new Prompt({
  name: 'user',
  message: 'Please provide the following information:',
  choices: [
    {
      name: 'firstname',
      message: 'First Name',
      initial: 'Jon',
      editable: true
    },
    {
      name: 'lastname',
      message: 'Last Name',
      initial: 'Schlinkert',
      editable: true
    },
    {
      name: 'email',
      message: 'Email address?',
      editable: true,
      validate(value, state) {
        if (value && !value.includes('@sellside.com')) {
          this.error = 'Invalid email address';
          return false;
        }
        this.error = void 0;
        return true;
      }
    }
  ]
});

prompt
  .run()
  .then(value => console.log('ANSWERS:', value))
  .catch(console.error);
