const Prompt = require('../lib/types/boolean');
const prompt = new Prompt({ message: 'Want to answer?', initial: true });

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
