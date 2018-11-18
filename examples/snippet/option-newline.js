'use strict';

const os = require('os');
const path = require('path');
const { Snippet } = require('enquirer');
const prompt = new Snippet({
  message: 'What config directory do you want to use?',
  newline: '',
  template: '~/.config/${appname}',
  format() {
    return '';
  },
  validate(value) {
    return !this.isValue(value.values.appname) ? 'Please enter a value' : true;
  },
  result(value) {
    value.result = path.join(os.homedir(), value.result.replace(/^~/, ''));
    return value;
  }
});

prompt.run()
  .then(answer => console.log('ANSWER', answer))
  .catch(console.log);
