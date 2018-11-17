'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const { MultiSelect } = require('..');
const log = require('./log-keypress');

const prompt = new MultiSelect({
  type: 'multiselect',
  name: 'colors',
  message: 'Pick your favorite colors',
  limit: 5,
  header() {
    return 'Keypress: ' + log(prompt) + ' ';
  },
  pointer(state, choice, i) {
    return (state.index === i ? state.symbols.pointer : ' ') + ' ';
  },
  choices: [
    { name: 'aqua', value: '#00ffff' },
    { name: 'black', value: '#000000' },
    { name: 'blue', value: '#0000ff', hint: '(this is a choice hint)' },
    { name: 'fuchsia', value: '#ff00ff' },
    { name: 'gray', value: '#808080' },
    { name: 'green', value: '#008000' },
    { name: 'lime', value: '#00ff00' },
    { name: 'maroon', value: '#800000' },
    { name: 'navy', value: '#000080' },
    { name: 'olive', value: '#808000' },
    { name: 'purple', value: '#800080' },
    { name: 'red', value: '#ff0000' },
    { name: 'silver', value: '#c0c0c0' },
    { name: 'teal', value: '#008080' },
    { name: 'white', value: '#ffffff' },
    { name: 'yellow', value: '#ffff00' }
  ]
});

prompt.run()
  .then(names => console.log('Answer:', names))
  .catch(console.error);
