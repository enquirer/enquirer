const colors = require('ansi-colors');
const spinners = require('cli-spinners');
const Prompt = require('../lib/prompts/multiselect');
const Animate = require('./animate');
const names = colors.keys.color;

const repeat = (arr, times = 1) => {
  let res = [];
  for (let ele of arr) res.push(...Array(times).fill(ele));
  return res;
};

const remove = (arr, omit = ['black', 'gray', 'grey', 'white']) => {
  return arr.filter(ele => !omit.includes(ele));
};

const message = (state, choice, i) => {
  if (choice.completing) {
    return 'resolving' + state.symbols.ellipsis;
  }
  return choice.name;
};

const indicator = (prompt, choice, index, options) => {
  if (choice.spinner) return choice.spinner;
  choice.pad = '  ';
  let opts = { ...choice, ...options };
  let ind = choice.origIndicator || (choice.origIndicator = choice.indicator);
  let framerate = opts.framerate || opts.interval || spinners.dots.interval;
  let colorRate = opts.colorRate || framerate;
  let animation = choice.spinner = new Animate({
    maxTime: 5000,
    framerate,
    frames: opts.frames || spinners.dots.frames,
    index,
    onStart() {
      choice.completing = true;
      choice.colorFrame = 0;
      choice.colorInt = setInterval(() => {
        choice.colorFrame++;
      }, colorRate);
    },
    async onUpdate() {
      let color = colors[animation.ele(repeat(remove(names)), choice.colorFrame)];
      choice.indicator = color(animation.frame());
      await prompt.render();
    },
    onFail() {
      choice.hint = prompt.styles.disabled('(cannot resolve choice)');
      choice.disabled = true;
      choice.enabled = false;
    },
    async onStop() {
      clearInterval(choice.colorInt);
      choice.completing = false;
      choice.indicator = ind;
      await prompt.render();
    },
    ...options
  });

  prompt.on('close', () => animation.stop());
  animation.start();
  return animation;
}

const prompt = new Prompt({
  name: 'example-groups',
  message: 'What are your favorite colors?',
  hint: 'Thinking...',
  choices: [
    {
      name: 'Blue',
      message,
      onChoice(state, choice, i) {
        indicator(prompt, choice, i, spinners.dots);
      }
    },
    {
      name: 'Red',
      message,
      onChoice(state, choice, i) {
        indicator(prompt, choice, i, { maxTime: 5000, ...spinners.dots, colorRate: 900 });
      }
    },
    {
      name: 'Fuscia',
      message,
      onChoice(state, choice, i) {
        if (!choice.spinner) {
          let animate = indicator(prompt, choice, i, spinners.dots);
          let timeout = setTimeout(() => {
            choice.enabled = true;
            animate.stop();
            prompt.render();
          }, 3000);
          prompt.on('close', () => clearTimeout(timeout));
        }
      }
    },
    {
      name: 'Maroon',
      onChoice(state, choice, i) {
        if (choice.completing) {
          choice.message = 'resolving' + prompt.symbols.ellipsis;
        } else {
          choice.message = choice.name;
        }
      },
    },
    {
      name: 'Green',
      message,
      onChoice(state, choice, i) {
        indicator(prompt, choice, i, { maxTime: 6000, ...spinners.dots, colorRate: 2000 });
      }
    },
    {
      name: 'Orange',
      message,
      onChoice(state, choice, i) {
        indicator(prompt, choice, i, { maxTime: 8000, ...spinners.dots });
      }
    },
    {
      name: 'Yellow',
      message,
      onChoice(state, choice, i) {
        indicator(prompt, choice, i, { maxTime: 9000, ...spinners.dots });
      }
    },
    {
      name: 'Cyan',
      message,
      hint: 'This is a hint',
      onChoice(state, choice, i) {
        indicator(prompt, choice, i, { maxTime: 7000, ...spinners.dots });
      }
    },
    {
      name: 'Grey',
      message,
      onChoice(state, choice, i) {
        indicator(prompt, choice, i, { maxTime: 6000, ...spinners.dots });
      }
    },
    {
      name: 'Aqua',
      message,
      onChoice(state, choice, i) {
        indicator(prompt, choice, i, { maxTime: 8000, ...spinners.dots });
      }
    },
    {
      name: 'Navy',
      message,
      onChoice(state, choice, i) {
        indicator(prompt, choice, i, { maxTime: 10000, ...spinners.dots });
      }
    },
    {
      name: 'Olive',
      message,
      onChoice(state, choice, i) {
        indicator(prompt, choice, i, { maxTime: 9000, ...spinners.dots });
      }
    }
  ]
});

prompt.run()
  .then(answer => console.log('\nAnswer:', answer))
  .catch(console.error);
