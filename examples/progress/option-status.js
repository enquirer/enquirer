'use strict';

const { Progress } = require('../..');

/**
 * Progress bar with status text updates.
 * Shows how to update both progress value and status text dynamically.
 * The 'showValue' option displays current/total (e.g., "3/5").
 */

const tasks = ['Init', 'Load', 'Compile', 'Test', 'Build'];

const prompt = new Progress({
  message: 'Building project',
  total: tasks.length,
  showValue: true
});

let current = 0;
const interval = setInterval(() => {
  prompt.update({
    value: current,
    status: tasks[current]
  });

  current++;
  if (current >= tasks.length) {
    clearInterval(interval);
    prompt.complete();
  }
}, 800);

prompt.run()
  .then(() => console.log('Build complete'))
  .catch(console.error);
