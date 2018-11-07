
const { prompt } = require('..');
let num = 1;

const transition = () => ({ type: 'transition', countdown: 5 });
const question = (name, message) => {
  return { type: 'input', name, message, prefix: String(num++) };
};

prompt([
  transition(),
  question('name', 'What is your name?')
  // transition(),
  // question('usename', 'What is your usename?'),
  // transition(),
  // question('email', 'What is your email address?'),
  // transition(),
  // question('color', 'What is your favorite color?'),
])
  .then(answer => console.log('ANSWER:', answer))
  .catch(console.error);

// const { prompt } = require('..');

// const question = (name, message, n) => {
//   return { type: 'input', name, message, prefix: String(n) }
// };

// prompt([
//   { type: 'transition' },
//   {
//     type: 'input',
//     name: 'name',
//     message: 'what is your name?',
//     prefix: '1'
//   },
//   { type: 'transition' },
//   {
//     type: 'input',
//     name: 'username',
//     message: 'what is your username?',
//     prefix: '2'
//   }
// ])
//   .then(answer => console.log('ANSWER:', answer))
//   .catch(console.error);
