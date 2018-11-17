'use strict';

const { NumberPrompt } = require('enquirer');

const prompt = new NumberPrompt({
  name: 'value',
  price: 7.75,
  message: 'How many tickets do you need?',
  float: false,
  validate(state) {
    return +state.value < 2 ? 'You must purchase 2 or more tickets' : true;
  },
  hint() {
    if (!this.state.submitted) {
      return this.styles.muted(`(${dollars(this.input, this.options.price)})`);
    }
  },
  format() {
    return this.state.submitted ? dollars(this.value, this.options.price) : this.value;
  }
});

function dollars(value, price = 1) {
  return '$' + (Number(value) * price).toFixed(2);
}

prompt.run()
  .then(value => console.log('Answer:', value))
  .catch(console.error);
