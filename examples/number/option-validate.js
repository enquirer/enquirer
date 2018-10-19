const Prompt = require('../../lib/types/number');
const prompt = new Prompt({
  name: 'value',
  price: 7.75,
  message: 'How many tickets do you need?',
  float: false,
  validate(state) {
    return +state.value < 2 ? 'You must purchase 2 or more tickets' : true;
  },
  hint() {
    if (!this.answered) {
      return this.styles.muted(`(${dollars(this.input, this.options.price)})`);
    }
  },
  format() {
    return this.answered ? dollars(this.value, this.options.price) : this.value;
  }
});

function dollars(value, price = 1) {
  return '$' + (Number(value) * price).toFixed(2);
}

prompt.run()
  .then(value => console.log('Answer:', value))
  .catch(console.error);
