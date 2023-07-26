'use strict';

const pause = (ms = 1000) => new Promise(res => setTimeout(res, ms));

const { Input } = require('enquirer');

const timeout = 5;
const prompt = new Input({
  message: '静夜思',
  keypressTimeout: timeout,
  multiline: true
});

const poem = `
静夜思

床前明月光，疑是地上霜。

举头望明月，低头思故乡。
`;

prompt.once('run', async() => {
  for (const input of [...poem]) {
    await prompt.keypress(input);
    await pause(timeout + 10);
  }

  prompt.submit();
});

prompt.run()
  .then(output => console.log({ output }))
  .catch(console.log);
