'use strict';

const { Progress } = require('../..');

/**
 * Progress bar with automatic ETA (estimated time remaining).
 * The progress bar calculates time remaining based on progress rate.
 * ETA is enabled by default but can be disabled with showETA: false.
 */

const prompt = new Progress({
  message: 'Processing files',
  total: 50,
  showETA: true
});

let current = 0;
const interval = setInterval(() => {
  current++;
  prompt.update(current);

  if (current >= 50) {
    clearInterval(interval);
    prompt.complete();
  }
}, 100);

prompt.run()
  .then(() => console.log('Complete'))
  .catch(console.error);
