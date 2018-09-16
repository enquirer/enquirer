const LazyChoices = require('../lazy-choices');
const prompt = new LazyChoices({
  name: 'flavors',
  message: 'Pick a flavor',
  choices: [
    'almond',
    'apple',
    'banana',
    'cherry',
    'chocolate'
  ]
  // async resolve(choice) {
  //   return
  // }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
