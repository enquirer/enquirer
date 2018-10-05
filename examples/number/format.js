const Prompt = require('../../lib/types/number');
const prompt = new Prompt({
  name: 'amount',
  message: 'How much do you want to donate?',
  float: true,
  cursor: 1,
  format(val) {
    return Intl.NumberFormat(void 0, { style: 'currency', currency: 'USD' }).format(val);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
