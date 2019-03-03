'use strict';

class Timers {
  constructor(prompt) {
    this.prompt = prompt;
    this.cache = {};
    prompt.state.timers = this.cache;
    if (prompt.options.timers) {
      this.addTimers(prompt.options.timers);
    }
  }

  addTimers(timers) {
    for (let name of Object.keys(timers)) {
      this.addTimer(name, timers[name]);
    }
  }

  addTimer(name, options = {}) {
    if (typeof options === 'number') options = { interval: options };
    let { prompt } = this;
    let timer = this.cache[name] = { name, start: Date.now(), ms: 0, tick: 0 };
    let ms = options.interval || 120;
    timer.frames = options.frames || [];
    timer.loading = true;

    let interval = setInterval(() => {
      timer.ms = Date.now() - timer.start;
      timer.tick++;
      prompt.render();
    }, ms);

    timer.stop = () => {
      timer.loading = false;
      clearInterval(interval);
    };

    Reflect.defineProperty(timer, 'interval', { value: interval });
    prompt.once('close', () => timer.stop());
    return timer.stop;
  }
}

module.exports = Timers;
