const { prompt } = require('enquirer');

prompt.on('cancel', () => process.exit());

const contractor = async() => {
  const register = async() => {
    menu();
  };

  const menu = async() => {
    const { action } = await prompt({
      type: 'select',
      name: 'action',
      message: 'what would you like to do?',
      choices: ['register', 'update', 'mine'],
      initial: 'register'
    });

    switch (action) {
      case 'register': {
        await register();
        break;
      }
      case 'update': {
        console.log('update');
        break;
      }
      case 'mine': {
        console.log('mine');
        break;
      }
      default: {
        console.log('mine');
        break;
      }
    }
  };
  menu();
};

const client = async() => {
  const query = async() => {
    menu();
  };
  const menu = async() => {
    const { action } = await prompt({
      type: 'select',
      name: 'action',
      message: 'what would you like to do?',
      choices: ['query', 'check'],
      initial: 'query'
    });
    switch (action) {
      case 'query': {
        await query();
        break;
      }
      case 'check': {
        console.log('check');
        break;
      }
      default: {
        await query();
        break;
      }
    }
  };
  menu();
};

const program = async() => {
  const { type } = await prompt({
    type: 'select',
    name: 'type',
    message: 'would you like to start a contractor or client?',
    choices: ['contractor', 'client'],
    initial: 'client'
  });

  if (!type || type === 'contractor') {
    return contractor();
  }
  return client();
};

program().catch((err) => {
  console.log(err);
});
