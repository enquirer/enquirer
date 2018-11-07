const colors = require('ansi-colors');
const Prompt = require('../lib/prompts/input');
const color = t => t >= 7 ? colors.green(t) : t > 3 ? colors.yellow(t) : colors.red(t);
let time = 5;
let int;

const prompt = new Prompt({
  name: 'name',
  message: 'What is your name?',
  prefix(state) {
    if (state.submitted) {
      return prompt.symbols.prefix[state.status];
    }
    return color(String(time).padEnd(2, ' '));
  },
  hint() {
    return ` (You have ${color(time)} seconds left to answer)`;
  },
  header() {
    return `You have ${color(time)} seconds left to answer`;
  },
  footer() {
    return `You have ${color(time)} seconds left to answer`;
  }
});

prompt.once('close', () => clearInterval(int));
prompt.once('run', () => {
  int = setInterval(() => {
    time--;
    if (time === 0) {
      prompt.cancel();
    } else {
      prompt.render();
    }
  }, 1000);
});

prompt.run()
  .catch(console.error);
