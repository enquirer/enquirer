# Form Prompt

The `Form` prompt enables users to provide multiple values on a single screen before submitting. 

**Todo: Examples**

- [ ] Custom indicator
- [ ] Custom symbols
- [ ] Field validation
- [ ] `options.validate`
- [ ] `choice.validate()`
- [ ] `options.format`
- [ ] `options.result`
- [ ] `options.hint`
- [ ] `choice.hint`
- [ ] `choice.format()`
- [ ] `choice.result()`
- [ ] Required fields (`options.required`)
- [ ] Default values (`options.initial`, `choice.initial`, `options.value`)
- [ ] Resetting
- [ ] ~~History / completion~~ (coming soon!)


**Example: Initial values**

```js
const { Form } = require('enquirer');

const prompt = new Form({
  name: 'user',
  message: 'Please provide the following information:',
  choices: [
    { name: 'firstname', message: 'First Name', initial: 'Jon' },
    { name: 'lastname', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'username', message: 'GitHub username', initial: 'jonschlinkert' }
  ]
});

let values = await prompt.run();
console.log('Values:', values);
```

**Example: Custom indicator**

```js
const { Form } = require('enquirer');

const prompt = new Form({
  name: 'user',
  message: 'Please provide the following information:',
  indicator() {
    return this.symbols.check;
  },
  choices: [
    { name: 'firstname', message: 'First Name', initial: 'Jon' },
    { name: 'lastname', message: 'Last Name', initial: 'Schlinkert' },
    { name: 'username', message: 'GitHub username', initial: 'jonschlinkert' }
  ]
});

prompt.run()
  .then(answers => console.log('Response:', answers))
  .catch(console.error);
```
