const { prompt } = require('../../lib/prompts/text');

prompt({ message: 'What is your name?', initial: 'Jane Doe' })
  .once('cancel', v => console.log(`Aborted with ${v}`))
  .once('submit', v => {
    console.log(`Submitted with ${v}`);

    prompt({ message: 'What is your name?', initial: 'Jane Doe' })
      .once('cancel', v => console.log(`Aborted with ${v}`))
      .once('submit', v => {
        console.log(`Submitted with ${v}`);
      });
  });

