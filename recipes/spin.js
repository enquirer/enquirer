const colors = require('ansi-colors');
const Prompt = require('../lib/prompts/input');
const spinners = require('cli-spinners');
const { frames, interval } = spinners.dots;
let i = 0;

const prompt = new Prompt({
  name: 'name',
  message: 'What is your name?',
  prefix(state) {
    return state.loading ? frames[++i % frames.length] : prompt.symbols.prefix;
  },
  separator(state) {
    return state.loading ? frames[(i + 3) % frames.length] : prompt.symbols.separator;
  }
});

// prompt.once('run', () => {
//   let stop = prompt.refresh('spinner', () => prompt.render());
//   let timeout = setTimeout(stop, 4000);
//   prompt.on('close', () => clearTimeout(timeout));
// });

// prompt.once('run', () => {
//   prompt.refresh('spinner', state => {
//     state.symbols.prefix = frames[state.spinner.tick % frames.length];
//     prompt.render();

//     if (state.spinner.ms >= 4000) {
//       prompt.submit();
//     }
//   });
// });
// prompt.on('refresh', () => prompt.render());

prompt.run()
  .catch(console.error);
