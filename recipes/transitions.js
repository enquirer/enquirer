
const { prompt } = require('..');
let num = 1;

const transition = () => ({ type: 'transition', countdown: 3 });
const question = (name, message) => {
  return { type: 'input', name, message, prefix: String(num++) };
};

prompt([
  transition(),
  question('name', 'What is your name?'),
  transition(),
  question('usename', 'What is your usename?'),
  transition(),
  question('email', 'What is your email address?'),,
  transition(),
  question('color', 'What is your favorite color?')
])
  .then(answer => console.log('ANSWER:', answer))
  .catch(console.error);
