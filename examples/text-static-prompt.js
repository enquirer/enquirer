const Prompt = require('../prompts/text');
const { Snippet, Text } = Prompt.types;

const { prompt } = require('../prompts/text');

prompt({ message: 'What is your name?', initial: 'Jane Doe' })
  .on('abort', v => console.log(`Aborted with ${v}.`))
  .on('submit', v => {
    console.log(`Submitted with ${v}.`);

    prompt({ message: 'What is your name?', initial: 'Jane Doe' })
      .on('abort', v => console.log(`Aborted with ${v}.`))
      .on('submit', v => {
        console.log(`Submitted with ${v}.`);
      });
  });
