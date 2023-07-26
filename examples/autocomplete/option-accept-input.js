'use strict';

const { AutoComplete } = require('enquirer');

const fakeChoice = input => ({ value: input, message: '', name: input });

const prompt = new AutoComplete({
  type: 'autocomplete',
  name: 'flavor',
  message: 'Pick your favorite flavor',
  suggest(typed, choices) {
    const maches = choices.filter(choice => choice.message.includes(typed));
    return maches.length ? maches : [fakeChoice(typed)];
  },
  choices: [
    'almond',
    'apple',
    'banana'
  ]
});

prompt.run()
  .then(output => console.log({ output }))
  .catch(console.log);
