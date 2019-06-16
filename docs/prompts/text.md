# Text Prompt

See [Input prompt](input.md).


**Example**

```js
const { Text } = require('enquirer');
const prompt = new Text({
  name: 'username',
  message: 'What is your username?'
});

prompt.run()
  .then(answer => console.log('Username:', answer))
  .catch(console.error);
```
