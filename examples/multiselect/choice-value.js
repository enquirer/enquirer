'use strict';

const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'example',
  message: 'Take your pick',
  choices: [
    { name: 'foo', value: true },
    { name: 'bar', value: false },
    { name: 'baz', value: 42 }
  ],
  result(names) {
    return this.map(names);
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
