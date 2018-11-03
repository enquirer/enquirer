const Enquirer = require('..');
const { Prompt } = Enquirer;

/**
 * > Using a custom Prompt class as an Enquirer plugin
 *
 * Custom prompt class - in this example, we use a custom prompt class
 * to show how to use a custom prompt as an Enquirer plugin.
 *
 * This is necessary if you want Enquirer to be able to automatically run
 * your custom prompt when specified on the question "type".
 */

class CustomPrompt extends Prompt {
  dispatch(ch) {
    if (!ch) return this.alert();
    this.input += ch;
    this.cursor += 1;
    this.render();
  }
  delete() {
    this.input = this.input.slice(0, -1);
    this.cursor = this.input.length;
    this.render();
  }
  render() {
    this.clear();
    let prefix = this.style(this.symbols.prefix[this.state.status]);
    let msg = this.styles.strong(this.state.message);
    let sep = this.styles.muted(this.symbols.separator[this.state.status]);
    let prompt = [prefix, msg, sep].filter(Boolean).join(' ');
    this.write(prompt + ' ' + this.input);
  }
}

const enquirer = new Enquirer();

// register your custom prompt "type" using whatever name you want.
// you can even override built-in prompts if necessary.
enquirer.register('custom-input', CustomPrompt);

// run your custom prompt
enquirer.prompt({
  type: 'custom-input', //<= specify your custom type to run the prompt
  name: 'username',
  message: 'What is your username?'
})
  .then(answers => console.log('ANSWERS:', answers))
  .catch(console.error);
