# Rendering

As mentioned in the 

Every prompt has a `.render()` method that is responsible for creating the string that will be written to the terminal (using `process.stdout.write()` by default).

 `Prompt`


You can programmatically test the string that's rendered (with `stdout.write()`) in the terminal using the following 

```js
      prompt.once('run', async() => {
        await prompt.keypress('b');
        await prompt.keypress('e');
        await prompt.keypress('r');
        await prompt.keypress('r');
        await prompt.keypress('y');
        console.log([prompt.state.buffer])
        await prompt.submit();
      });
const question = {
  format(value) {

  }
};
```
