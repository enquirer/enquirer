console.time('inquirer');
require('inquirer');
console.timeEnd('inquirer');
console.time('enquirer');
require('..');
console.timeEnd('enquirer');
console.time('prompts');
require('prompts');
console.timeEnd('prompts');

// inquirer: 155.782ms
// enquirer: 0.490ms
// prompts: 7.884ms
