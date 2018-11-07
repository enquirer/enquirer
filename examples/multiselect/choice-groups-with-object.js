const Prompt = require('../../lib/prompts/multiselect');
const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  choices: normalize({
    local: ['scaffolds', 'package'],
    global: ['npm', 'git'],
    other: [],
    default: { message: 'Default generator' }
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
