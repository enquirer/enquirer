const { prompt } = require('../..');

(async() => {

  const response = await prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name?'
    },
    {
      type: 'number',
      name: 'tickets',
      message: 'How many tickets do you need?',
      initial: 2,
      float: false,
      validate(value) {
        return Number(value) < 2 ? 'You must purchase 2 or more tickets' : true;
      }
    },
    {
      type: 'confirm',
      name: 'order',
      async message(state, status, prompt, answers) {
        let amount = (answers.tickets * 8.50).toFixed(2);
        return `You wish to puchase ${answers.tickets} tickets, for $${amount}?`;
      }
    }
  ]);

  console.log(response);
})();
