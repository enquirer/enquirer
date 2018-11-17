'use strict';

const yosay = require('yosay');
const colors = require('ansi-colors');
const { MultiSelect } = require('enquirer');

/**
 * Example that shows all of the prompt elements displayed at once.
 */

const prompt = new MultiSelect({
  type: 'multiselect',
  name: 'colors',
  message: 'Pick your favorite colors',
  hint: '(Use <space> to select, <return> to submit)',
  limit: 6,
  header: yosay('Welcome to my awesome generator!'),
  format() {
    return prompt.input + ' ' + prompt.styles.muted(prompt.state.hint);
  },
  pointer(state, choice, i) {
    return (state.index === i ? state.symbols.pointer : ' ') + ' ';
  },
  footer(state) {
    if (state.limit < state.choices.length) {
      return colors.dim('(Scroll up and down to reveal more choices)');
    }
  },
  result(names) {
    return this.map(names);
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
    { name: 'purple', value: '#800080', hint: colors.red('(this is a colored choice hint)') },
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
