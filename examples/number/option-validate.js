const Prompt = require('../../lib/types/number');
const prompt = new Prompt({
  name: 'value',
  price: 7.75,
  message: 'How many tickets do you need?',
  float: false,
  validate(value) {
    return +value < 2 ? 'You must purchase 2 or more tickets' : true;
  },
  hint() {
    if (!this.answered) {
      return this.styles.muted(`(${dollars(this.input, this.options.price)})`);
    }
  },
  format(value) {
    return this.answered ? dollars(value, this.options.price) : value;
  }
});

function dollars(value, price = 1) {
  return '$' + (Number(value) * price).toFixed(2);
}

prompt.run()
  .then(value => console.log('Answer:', value))
  .catch(console.error);
