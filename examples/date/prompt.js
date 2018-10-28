const DatePrompt = require('../../lib/types/date');

const prompt = new DatePrompt({
  message: 'When is your birthday?',
  index: 0
});

prompt.run().catch(console.error);
