const Prompt = require('../../lib/types/number');
const prompt = new Prompt({
  name: 'value',
  message: 'How many tickets do you need?',
  validate(value) {
    // console.log([value, typeof value])
    return +value < 2 ? 'You must purchase 2 or more tickets' : true;
  }
});

prompt.run()
  .then(value => console.log('Answer:', value))
  .catch(console.error);
