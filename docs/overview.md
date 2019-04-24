# Enquirer Overview

**Enquirer is a prompt runner**

Add Enquirer to your JavaScript project with following line of code.

```js
const Enquirer = require('enquirer');
```

The main export of this library is the `Enquirer` class, which has methods and features designed to simplify running prompts.

```js
const { prompt } = require('enquirer');
const question = [
  {
    type: 'input',
    name: 'username',
    message: 'What is your username?'
  },
  {
    type: 'password',
    name: 'password',
    message: 'What is your password?'
  }
];

let answers = await prompt(question);
console.log(answers);
```

**Prompts control how values are rendered and returned**

Each individual prompt is a class with special features and functionality for rendering the types of values you want to show users in the terminal, and subsequently returning the types of values you need to use in your application.

**How can I customize prompts?**

Below in this guide you will find information about creating [custom prompts](#-custom-prompts). For now, we'll focus on how to customize an existing prompt.

All of the individual [prompt classes](#built-in-prompts) in this library are exposed as static properties on Enquirer. This allows them to be used directly without using `enquirer.prompt()`.

Use this approach if you need to modify a prompt instance, or listen for events on the prompt.

**Example**

```js
const { Input } = require('enquirer');
const prompt = new Input({
  name: 'username',
  message: 'What is your username?'
});

prompt.run()
  .then(answer => console.log('Username:', answer))
  .catch(console.error);
```
