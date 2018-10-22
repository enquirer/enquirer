'use strict';

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
  }

  ele(arr, i = this.state.index) {
    return arr[i % arr.length];
  }

  frame() {
    return this.ele(this.frames);
  }

  async start() {
    this.failed = setTimeout(this.fail, this.maxTime);
    await this.onStart.call(this, this.state);
    await this.update();
  }

  update() {
    clearTimeout(this.state.timeout);
    this.state.timeout = setTimeout(async() => {
      await this.onUpdate.call(this, this.state);
      await this.update(++this.state.index);
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
