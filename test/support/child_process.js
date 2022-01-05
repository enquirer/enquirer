import Enquirer from '../../index.js';

const { prompt } = Enquirer;

const question = {
  type: 'input',
  name: 'color',
  message: 'Favorite color?'
};

prompt(question)
  .then(answers => {
    console.info(answers);
    process.exit(0);
  });
