const colors = require('ansi-colors');
const Prompt = require('../../lib/prompts/select');

const prompt = new Prompt({
  name: 'song',
  message: 'Favorite song?',
  symbols: { pointer: { on: '♫', off: ' ' } },
  choices: [
    { message: 'Fugue in D Minor', name: 'Bach' },
    { message: 'Piano Concerto No. 3', name: 'Rachmaninoff' },
    { message: 'Serenade No. 13 "Eine kleine Nachtmusik"', name: 'Mozart' }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
