const colors = require('ansi-colors');
const spinners = require('cli-spinners');
const { get, set } = require('../lib/utils');
const Prompt = require('../lib/prompts/multiselect');
const Animate = require('./animate');
const names = colors.keys.color;

const frame = (arr, i) => arr[i % arr.length];
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

const keys = repeat(remove(names));

const indicator = (prompt, choice, index, options) => {
  if (choice.spinner) return choice.spinner;
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
      let color = colors[animation.ele(keys, choice.colorFrame)];
      choice.indicator = color(animation.frame());
      await prompt.render();
    },
    onFail() {
      // choice.hint = prompt.styles.disabled('(cannot resolve choice)');
      // choice.disabled = true;
      // choice.enabled = false;
    },
    async onStop() {
      clearInterval(choice.colorInt);
      choice.completing = false;
      choice.indicator = ind;
    },
    ...options
  });

  prompt.on('close', () => animation.stop());
  animation.start();
  return animation;
};

const prompt = new Prompt({
  name: 'example-choice-spinners',
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
        indicator(prompt, choice, i, { maxTime: 3000, ...spinners.dots, colorRate: 900 });
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
      name: 'Maroon'
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
        indicator(prompt, choice, i, { maxTime: 4000, ...spinners.dots });
      }
    }
  ]
});

const inject = (prop, fn) => {
  let orig = get(prompt, prop);

  const restore = () => set(prompt, prop, orig);
  const update = value => {
    let completing = prompt.choices.filter(ch => ch.completing);
    if (completing.length) {
      set(prompt, prop, value);
    } else {
      if (fn) fn(prompt.state);
      restore();
    }
  };

  return { update, restore };
};

prompt.once('run', () => {
  let i = 0;
  let j = 0;

  let prefix = inject('symbols.prefix.pending');
  let sep = inject('symbols.separator', state => {
    state.hint = 'Ready to go!';
  });

  prompt.state.interval = setInterval(() => {
    prefix.update(colors.cyan(frame(spinners.point.frames, ++i)));
    prompt.render();
  }, 120);

  prompt.state.interval2 = setInterval(() => {
    sep.update(colors.green(frame(spinners.point.frames, ++j)));
    prompt.render();
  }, 120);
});

prompt.once('close', () => {
  clearInterval(prompt.state.interval);
  clearInterval(prompt.state.interval2);
});

prompt.run()
  .then(answer => console.log('\nAnswer:', answer))
  .catch(console.error);
