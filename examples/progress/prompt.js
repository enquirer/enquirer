'use strict';

const { Progress } = require('../..');

/**
 * Basic progress bar example with determinate progress (0-100%).
 * Updates progress in increments until completion.
 */

const prompt = new Progress({
  message: 'Downloading files',
  total: 100
});

let current = 0;
const interval = setInterval(() => {
  current += 10;
  prompt.update(current);

  if (current >= 100) {
    clearInterval(interval);
    prompt.complete();
  }
}, 200);

prompt.run()
  .then(answer => console.log('Finished:', answer))
  .catch(console.error);
