const Text = require('../../lib/prompts/text');
const Form = require('../../lib/prompts/form');

const name = new Text({
  name: 'name',
  message: 'What is your name?'
});

const address = new Text({
  name: 'address',
  message: 'What is your address?'
});

const email = new Text({
  name: 'email',
  message: 'What is your email?'
});

const form = new Form({
  name: 'signup',
  type: 'form',
  choices: [name, address, email]
});

class SomePrompt extends Prompt {
  constructor(options) {
    super(options);
    this.string = '';
  }
  write(value) {
    this.string += value;
  }
  foo(value) {
    super.write(value);
  }
  toChoice(choice, i) {
    let ele = super.toChoice(choice, i);
    let { write, render } = ele;
    if (write && render) {
      ele.string = '';
      ele.write = (val = '') => (ele.string += val);
      ele.render = (...args) => {
        render.call(ele, ...args);
        const str = ele.string;
        ele.string = '';
        return str;
      };
    }
  }
}

