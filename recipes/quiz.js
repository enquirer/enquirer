const colors = require('ansi-colors');
const Prompt = require('../lib/prompts/input');
const color = t => t >= 7 ? colors.green(t) : t > 3 ? colors.yellow(t) : colors.red(t);
let time = 5;
let int;

const prompt = new Prompt({
  name: 'name',
  // you can put the "countdown" in the prefix, footer, header,
  // separator, or whatever position you like.
  header() {
    return `${colors.dim('You have')} ${color(time)} ${colors.dim('seconds left to answer!')}`;
  },
  separator() {
    return '';
  },
  message(state) {
    if (state.submitted && !state.input) return 'Really? Your own name?';
    return state.submitted ? 'Well done,' : 'What is your full name!!!'
  },
});

prompt.once('close', () => clearInterval(int));
prompt.once('run', () => {
  int = setInterval(() => {
    time--;
    if (time === 0) {
      prompt.state.input = '';
      prompt.cancel();
    } else {
      prompt.render();
    }
  }, 1000);
});

prompt.run()
  .catch(console.error);
