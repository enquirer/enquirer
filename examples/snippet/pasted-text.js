const { Snippet } = require('enquirer');

const pause = (ms = 1000) => new Promise(res => setTimeout(res, ms));
const prompt = new Snippet({
  name: 'Author Name',
  fields: [{ name: 'name', message: 'Author Name' }],
  template: 'hello ${name}'
});

const typed = '床前明月光，疑是地上霜。举头望明月，低头思故乡。';

prompt.once('run', async() => {
  for (const input of [...typed]) {
    await prompt.keypress(input);

    // simulate typing (really fast lol)
    await pause(20);
  }

  prompt.submit();
});

prompt.run()
  .then(answer => {
    console.log('Answer:');
    console.log(answer);
  })
  .catch(console.log);
