'use strict';

const { List } = require('enquirer');
const prompt = new List({
  name: 'keywords',
  message: 'Type comma-separated keywords'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
