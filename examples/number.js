const Prompt = require('prompt-base/lib/types/number');
const prompt = new Prompt({
  name: 'amount',
  message: 'How much do you want to donate?',
  float: true,
  format(val) {
    return Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(val);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
