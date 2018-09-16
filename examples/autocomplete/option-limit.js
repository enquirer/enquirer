const Prompt = require('../../lib/prompts/autocomplete');
const prompt = new Prompt({
  name: 'flavor',
  message: 'Pick your favorite flavor',
  limit: 6,
  suggest(typed) {
    return this.choices.filter(item => item.message.includes(typed));
  },
  choices: [
    'almond',
    'apple',
    'banana',
    'cherry',
    'chocolate',
    'cinnamon',
    'coconut',
    'cotton candy',
    'grape',
    'nougat',
    'orange',
    'pear',
    'pineapple',
    'strawberry',
    'vanilla',
    'watermelon',
    'wintergreen'
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
