require('time-require');
console.time('prompts');
require('prompts');
console.timeEnd('prompts');
// prompts: 25.653ms (first run)
// prompts: 12.642ms (second run)
// prompts: 12.736ms (third run)
// avg: 17.010ms
