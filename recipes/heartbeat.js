const Prompt = require('../lib/prompts/multiselect');
const { green, red, dim, symbols } = require('ansi-colors');

const rhythm = [red.dim, red, red.dim, red, red.dim, red.dim];
const frame = (frames, i) => frames[i % frames.length];

const prompt = new Prompt({
  name: 'prompt',
  message: 'Select your favorite Enquirer prompt?',
  choices: ['Snippet', 'Survey', 'Form', 'Multiselect', 'Radio'],
  symbols: {
    prefix: red.dim('❤')
  },
  async submit() {
    prompt.symbols.prefix = green(symbols.check);
    await prompt.render();
    return this.constructor.prototype.submit.call(this);
  }
});

prompt.on('run', () => {
  (function heartbeat(ms, i) {
    prompt.state.timeout = setTimeout(async() => {
      prompt.symbols.prefix = frame(rhythm, i)('❤');
      await prompt.render();
      heartbeat(ms, i + 1);
    }, ms);
  })(250, 0);
});

prompt.once('close', async() => clearTimeout(prompt.state.timeout));

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
