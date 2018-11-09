const Prompt = require('../../lib/types/number');
const prompt = new Prompt({
  name: 'amount',
  message: 'How much do you want to donate?',
  float: true,
  cursor: 1,
  format(input = this.input) {
    return Intl.NumberFormat(void 0, { style: 'currency', currency: 'USD' }).format(input);
  }
});

prompt.run()
  .then(answer => console.log('Answer: $' + answer, 'dollars'))
  .catch(console.error);
