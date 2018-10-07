require('time-require');
console.time('prompts');
require('prompts');
console.timeEnd('prompts');
// prompts: 35.469ms (first run)
// prompts: 21.799ms (second run)
// prompts: 27.912ms (third run)
