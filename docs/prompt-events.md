## Prompt Events

The recipe shows how to use events with prompts.

**Using events as an alternative to promises**

```js
const { Input } = require('enquirer');
const prompt = new Input({ name: 'username', message: 'What is your username?' })
  .on('keypress', (s, key) => console.log([s, key]))
  .on('submit', answer => console.log(answer))
  .on('cancel', error => console.log(error))
  .run();
```
