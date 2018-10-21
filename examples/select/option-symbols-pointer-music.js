const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/select');

const prompt = new Prompt({
  name: 'song',
  message: 'Favorite song?',
  symbols: { pointer: { on: '♫', off: ' ' } },
  choices: [
    'Bach - Fugue in D Minor',
    'Rachmaninoff - Piano Concerto No. 3',
    'Mozart - Serenade No. 13 "Eine kleine Nachtmusik"'
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
