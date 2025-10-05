'use strict';

const { Progress } = require('../..');

/**
 * Indeterminate progress (spinner) example.
 * Displays an animated spinner when total duration is unknown.
 * Omit the 'total' option to use spinner mode.
 */

const prompt = new Progress({
  message: 'Processing data'
});

setTimeout(() => {
  prompt.complete('Done!');
}, 3000);

prompt.run()
  .then(() => console.log('Complete'))
  .catch(console.error);
