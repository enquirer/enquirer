## Keypress Events

The recipe shows how to log keypress events with any prompt.

```js
const { Input } = require('enquirer');
const prompt = new Input({ name: 'username', message: 'What is your username?' });
const keypresses = [];

prompt.on('keypress', (s, key) => keypresses.push(key));

prompt.run()
  .then(() => console.log(keypresses))
  .catch(console.log);
```
