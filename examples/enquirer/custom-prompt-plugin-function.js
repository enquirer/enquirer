const Enquirer = require('enquirer');

/**
 * This example builds off of the "custom-prompt-plugin-class.js" example.
 *
 * When you register a custom Prompt class as a plugin, you can optionally
 * wrap your class in a function with `Prompt` and `enquirer` params, where
 * `Prompt` is a the base Prompt class, and `enquirer` is an instance
 * of Enquirer.
 */

const customPrompt = (Prompt, enquirer) => {

  class CustomInput extends Prompt {
    dispatch(ch) {
      if (!ch) return this.alert();
      this.value = (this.value || '') + ch;
      this.cursor += 1;
      this.render();
    }
    delete() {
      let value = this.value || '';
      this.value = value ? value.slice(0, -1) : '';
      this.cursor = value.length;
      this.render();
    }
    async render() {
      this.clear();
      let value = this.value || '';
      let message = await this.message();
      this.write(`${message} ${value}`);
    }
  }

  return CustomInput;
};

const enquirer = new Enquirer();

enquirer.register('custom-input', customPrompt);

const question = {
  type: 'custom-input',
  name: 'username',
  message: 'What is your username?'
};

enquirer.prompt(question)
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
