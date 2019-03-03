require('time-require');
console.time('prompts');
require('prompts');
console.timeEnd('prompts');
// prompts: 25.653ms (first run)
// prompts: 12.642ms (second run)
// prompts: 12.736ms (third run)
// prompts: 28.526ms (forth run)
// total: 79.557ms
// avg: 19.88925ms
