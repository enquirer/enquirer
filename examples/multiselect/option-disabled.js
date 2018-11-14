const colors = require('ansi-colors');
const { MultiSelect } = require('../..');

const prompt = new MultiSelect({
  name: 'food',
  message: 'What are your favorite foods?',
  choices: [
    'Lasagna',
    'Pizza',
    {
      name: 'Funnel Cakes',
      disabled: colors.red('Not today!'),
      indicator: '-'
    },
    'Chicken Curry',
    'Tacos'
  ]
});

prompt.run()
  .then(console.log)
  .catch(console.log);
