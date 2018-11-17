const { Prompt } = require('enquirer');

/**
 * _Using a custom Prompt class_
 *
 * Custom prompt class - in this example, we create custom prompt by
 * extending the built-in Prompt class (the base class used by all
 * Enquirer prompts).
 *
 * Here we use this custom prompt as a standalone prompt, but you can
 * also register prompts as plugins on enquirer
 *
 * (see "custom-prompt-plugin-class.js" example for more details).
 */

class CustomPrompt extends Prompt {
  dispatch(ch) {
    if (!ch) return this.alert();
    this.value += ch;
    this.cursor += 1;
    this.render();
  }
  delete() {
    this.value = this.value.slice(0, -1);
    this.cursor = this.value.length;
    this.render();
  }
  render() {
    this.clear();
    this.write(this.renderMessage(this.value));
  }
}

const prompt = new CustomPrompt({
  type: 'input',
  name: 'username',
  message: 'What is your username?'
});

prompt.run()
  .then(answer => console.log('ANSWER:', answer))
  .catch(console.error);
