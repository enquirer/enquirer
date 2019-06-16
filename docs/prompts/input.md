# Input Prompt

**Todo**

- [ ] Custom pointer
- [ ] Custom symbols
- [ ] Hint
- [ ] History / completion


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
