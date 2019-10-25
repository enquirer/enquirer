const { dim, green, red, yellow } = require('ansi-colors');
const { Input } = require('enquirer');
const color = t => t >= 7 ? green(t) : t > 3 ? yellow(t) : red(t);
let time = 5;
let int;

/**
 * This example shows how to create a "countdown" effect. You can
 * put the countdown timer in the prefix, footer, header, separator,
 * or whatever prompt position makes sense for your goal.
 */

const prompt = new Input({
  name: 'name',
  header() {
    return `${dim('You have')} ${color(time)} ${dim('seconds left to answer!')}`;
  },
  separator() {
    return ''; // hide separator
  },
  message(state) {
    if (state.submitted && !state.input) return 'Really? Your own name?';
    return state.submitted ? 'Well done,' : 'What is your full name!!!';
  }
});

prompt.once('close', () => clearInterval(int));
prompt.once('run', () => {
  int = setInterval(() => {
    if (time-- === 0) {
      prompt.state.input = '';
      prompt.cancel();
    } else {
      prompt.render();
    }
  }, 1000);
});

prompt.run()
  .catch(console.error);
