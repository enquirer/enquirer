
const Enquirer = require('../index');
const utils = require('../lib/utils');

const enquirer = new Enquirer({
  actions: {
    ctrl: {
      o: 'previousPrompt'
    }
  }
});

const previousPrompt = async function () {
  await this.submit();
  this.emit('previousPrompt');
};

let currentPromptIndex = 0;

const prompt = async (questions) => {
  let prompts = [];

  for (let question of [].concat(questions)) {
    if (typeof question === 'function') {
      question = await question.call(enquirer);
    }
    prompts.push(question);
  }

  let promptHistory = {},
    question,
    totalNoOfPrompts = prompts.length;

  enquirer.on('submit', function (value) {
    promptHistory[currentPromptIndex] = { before: question, after: value };
    currentPromptIndex++;
  });

  enquirer.on('previousPrompt', function () {
    if (currentPromptIndex > 1) currentPromptIndex -= 2;
  });

  do {
    question = prompts[currentPromptIndex];
    let state = promptHistory[currentPromptIndex];
    try {
      if (typeof question === 'function') question = await question.call(enquirer);
      if (state && state.after) {
        question.initial = state.after;
      }

      question.previousPrompt = previousPrompt;

      await enquirer.ask(utils.merge({}, enquirer.options, question));
    } catch (err) {
      return Promise.reject(err);
    }

  } while (currentPromptIndex < totalNoOfPrompts);

  return enquirer.answers;
};

prompt([
  {
    type: 'input',
    name: 'first',
    initial: '',
    message: 'Please enter your first name',
  },
  {
    type: 'input',
    name: 'last',
    message() {
      return `Hi ${this.state.answers.first}! Please enter your last name`;
    }
  },
  {
    type: 'multiselect',
    name: 'color',
    message: 'Pick your favorite colors',
    limit: 7,
    choices: [
      { name: 'aqua', value: '#00ffff' },
      { name: 'black', value: '#000000' },
      { name: 'blue', value: '#0000ff' },
      { name: 'fuchsia', value: '#ff00ff' },
      { name: 'gray', value: '#808080' },
      { name: 'green', value: '#008000' },
      { name: 'lime', value: '#00ff00' },
      { name: 'maroon', value: '#800000' },
      { name: 'navy', value: '#000080' },
      { name: 'olive', value: '#808000' },
      { name: 'purple', value: '#800080' },
      { name: 'red', value: '#ff0000' },
      { name: 'silver', value: '#c0c0c0' },
      { name: 'teal', value: '#008080' },
      { name: 'white', value: '#ffffff' },
      { name: 'yellow', value: '#ffff00' }
    ]
  },
  {
    type: 'input',
    name: 'age',
    message() {
      return `How old are you?`;
    }
  }
])
  .then(answers => console.log(answers))
  .catch(err => console.error(err));