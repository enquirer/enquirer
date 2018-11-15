## Keypress Events

The recipe shows how to log keypress events with any prompt.

**See all keypresses as they are entered**

```js
const { Input } = require('enquirer');
const prompt = new Input({ name: 'username', message: 'What is your username?' });

prompt.on('keypress', (s, key) => console.log([s, key]));

prompt.run()
  .then(answer => console.log(answer))
  .catch(console.log);
```

**See all keypresses after submit**

```js
const { Input } = require('enquirer');
const prompt = new Input({ name: 'username', message: 'What is your username?' });
const keypresses = [];

prompt.on('keypress', (s, key) => keypresses.push(key));

prompt.run()
  .then(() => console.log(keypresses))
  .catch(console.log);
```

