# Enquirer Usage

## Single prompt

The easiest way to get started with enquirer is to pass a [question object](#prompt-options) to the `prompt` method.

```js
const { prompt } = require('enquirer');

const response = await prompt({
  type: 'input',
  name: 'username',
  message: 'What is your username?'
});

console.log(response); // { username: 'jonschlinkert' }
```

_(Examples with `await` need to be run inside an `async` function)_


## Multiple prompts

Pass an array of ["question" objects](#prompt-options) to run a series of prompts.

```js
const response = await prompt([
  {
    type: 'input',
    name: 'name',
    message: 'What is your name?'
  },
  {
    type: 'input',
    name: 'username',
    message: 'What is your username?'
  }
]);

console.log(response); // { name: 'Edward Chan', username: 'edwardmchan' }
```

## Different ways to run enquirer

### 1. By importing the specific `built-in prompt`

```js
const { Confirm } = require('enquirer');

const prompt = new Confirm({
  name: 'question',
  message: 'Did you like enquirer?'
});

prompt.run()
  .then(answer => console.log('Answer:', answer));
```

### 2. By passing the options to `prompt`

```js
const { prompt } = require('enquirer');

prompt({
  type: 'confirm',
  name: 'question',
  message: 'Did you like enquirer?'
})
  .then(answer => console.log('Answer:', answer));
```

**Jump to**: [Getting Started](#-getting-started) · [Prompts](#-prompts) · [Options](#-options) · [Key Bindings](#-key-bindings)
