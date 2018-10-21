const colors = require('ansi-colors');
const noop = () => {};

class Animate {
  constructor(options = {}) {
    this.options = options;
    this.frames = options.frames || [];
    this.maxTime = options.maxTime || Infinity;
    this.framerate = options.framerate || 80;
    this.onUpdate = options.onUpdate || noop;
    this.onStart = options.onStart || noop;
    this.onStop = options.onStop || noop;
    this.onFail = options.onFail || noop;
    this.update = this.update.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.fail = this.fail.bind(this);
    this.state = { timeout: null, count: 0, index: options.index || 0 };
    this.failed = setTimeout(this.fail, this.maxTime);
  }

  ele(arr, i = this.state.index) {
    return arr[i % arr.length];
  }

  frame() {
    return this.ele(this.frames);
  }

  async start() {
    await this.onStart.call(this, this.state);
    await this.update();
  }

  update() {
    clearTimeout(this.state.timeout);
    this.state.timeout = setTimeout(async() => {
      await this.update(++this.state.index);
      await this.onUpdate.call(this, this.state);
    }, this.framerate);
  }

  async stop() {
    clearTimeout(this.failed);
    clearTimeout(this.state.timeout);
    await this.onStop.call(this, this.state);
  }

  async fail() {
    await this.onFail.call(this, this.state);
    await this.stop();
  }
}

module.exports = Animate;

// const repeatElements = (arr, times = 5) => {
//   let res = [];
//   for (let ele of arr) {
//     res.push(...Array(times).fill(ele));
//   }
//   return res;
// };

// const remove = (arr, blacklist) => {
//   let omit = blacklist || ['black', 'gray', 'grey', 'white'];
//   return arr.filter(ele => !omit.includes(ele));
// };

// const ansi = require('../lib/ansi');
// const write = str => process.stdout.write(str);

// const animate = new Animate({
//   maxTime: 5000,
//   frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
//   onStart() {
//     write(ansi.cursor.hide());
//   },
//   onUpdate(state) {
//     write('\r' + this.frame());
//   },
//   onStop() {
//     write(ansi.cursor.show());
//     write('\n');
//   },
//   onFail() {
//     console.log(colors.red('Oh no! It failed!'));
//   }
// });

// const animate = (options = {}) => {
//   let { prompt } = options;

//   return new Animate({
//     maxTime: 5000,
//     frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
//     onStop: () => options.prompt.render(),
//     ...options
//   });
// };

// animate.start();
