const { prompts, utils } = require('..');
const { AutoComplete } = prompts;
const { timeout } = utils;

const prompt = new AutoComplete({
  message: 'Search for your favorite actor:',
  suggest(typed, choices) {
    const search = async() => choices.filter(choice => choice.message.includes(typed));
    return timeout(search, 250);
  },
  choices: [
    'Adam Sandler',
    'Akshay Kumar',
    'Amy Adam',
    'Cate Blanchett',
    'Charlize Theron',
    'Chris Evans',
    'Chris Hemsworth',
    'Chris Pratt',
    'Dwayne "The Rock" Johnson',
    'Emma Stone',
    'Emma Watson',
    'Jackie Chan',
    'Jennifer Aniston',
    'Jennifer Lawrence',
    'Jeremy Renner',
    'Julia Roberts',
    'Mark Ruffalo',
    'Mark Wahlberg',
    'Matt Damon',
    'Melissa McCarthy',
    'Mila Kunis',
    'Robert Downey, Jr.',
    'Ryan Gosling',
    'Ryan Reynolds',
    'Salman Khan',
    'Samuel L. Jackson',
    'Shah Rukh Khan',
    'Tom Cruise',
    'Tom Hanks',
    'Vin Diesel'
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
