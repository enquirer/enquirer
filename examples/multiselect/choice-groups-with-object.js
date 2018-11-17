'use strict';

const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'example-groups',
  message: 'Take your pick',
  choices: normalize({
    local: ['one', 'two'],
    global: ['three', 'four'],
    other: [],
    default: { message: 'Five' }
  })
});

function normalize(obj) {
  if (Array.isArray(obj)) {
    return obj.map(ch => typeof ch === 'string' ? { name: ch } : ch);
  }

  let choices = [];
  for (let name of Object.keys(obj)) {
    let choice = { name };
    let value = obj[name];
    choices.push(choice);

    if (Array.isArray(value)) {
      let res = normalize(value);
      if (res.length) choice.choices = res;
    } else {
      choices[choices.length - 1] = { ...choice, ...value };
    }
  }
  return choices;
}

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
