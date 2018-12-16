# Custom Prompts

With Enquirer 2.0, custom prompts are easier than ever to create and use.

**How do I create a custom prompt?**

Custom prompts are created by extending Enquirer's `Prompt` class, or one of the built-in [prompts](#-prompts) or low-level [types](#-types).

<!-- Example: HaiKarate Custom Prompt -->

```js
const { Prompt } = require('enquirer');

class HaiKarate extends Prompt {
  constructor(options = {}) {
    super(options);
    this.value = options.initial || 0;
    this.cursorHide();
  }
  up() {
    this.value++;
    this.render();
  }
  down() {
    this.value--;
    this.render();
  }
  render() {
    this.clear(); // clear previously rendered prompt from the terminal
    this.write(`${this.state.message}: ${this.value}`);
  }
}

// Use the prompt by creating an instance of your custom prompt class.
const prompt = new HaiKarate({
  message: 'How many sprays do you want?',
  initial: 10
});

prompt.run()
  .then(answer => console.log('Sprays:', answer))
  .catch(console.error);
```

If you want to be able to specify your prompt by `type` so that it may be used alongside other prompts, you will need to first create an instance of `Enquirer`.

```js
const Enquirer = require('enquirer');
const enquirer = new Enquirer();
```

Then use the `.register()` method to add your custom prompt.

```js
enquirer.register('haikarate', HaiKarate);
```

Now you can do the following when defining "questions".

```js
let spritzer = require('cologne-drone');
let answers = await enquirer.prompt([
  {
    type: 'haikarate',
    name: 'cologne',
    message: 'How many sprays do you need?',
    initial: 10,
    async onSubmit(name, value) {
      await spritzer.activate(value); //<= activate drone
      return value;
    }
  }
]);
```
