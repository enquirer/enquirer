const Prompt = require('../lib/prompts/multiselect');
const colors = require('ansi-colors');
const spinners = require('cli-spinners');

let index = 0;
let step = 50;
const keys = Object.keys(spinners);
// const frames = spinners.dots.frames;
const ele = (arr, i) => arr[i % arr.length];
const frame = i => ele(styles, i)(ele(spinners[ele(keys, i % step === 0 ? index++ : index)].frames, i));

const repeat = (arr, times = 2, blacklist) => {
  let omit = blacklist || ['black', 'gray', 'grey', 'white'];
  return arr.reduce((acc, n) => {
    if (omit.includes(n)) return acc;
    let list = Array(times).fill(colors[n]);
    return acc.concat(list);
  }, []);
};

const styles = repeat(colors.keys.color, 3);

const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  choices: ['Foo', 'Bar', 'Baz'],
  symbols: {
    prefix: frame(0)
  }
});

prompt.on('run', () => {
  (function timeout(ms, i) {
    prompt.state.timeout = setTimeout(() => {
      prompt.symbols.prefix = frame(i);
      prompt.render();
      timeout(ms, i + 1);
    }, ms);
  })(80, 0);
});

prompt.once('close', () => clearTimeout(prompt.state.timeout));

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
