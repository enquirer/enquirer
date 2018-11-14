const { MultiSelect } = require('../..');
const colors = require('ansi-colors');
const yosay = require('yosay');

/**
 * Example of creating a silly easter egg for users.
 *
 * To see the easter egg, use `<fn>+<down>` or (`<Page Down>` on windows)
 * then scroll to a visible choice with an index of greater than 5.
 */

const prompt = new MultiSelect({
  name: 'colors',
  message: 'Pick your favorite colors',
  header() {
    let dude = yosay('Welcome to my awesome generator!');
    if (this.index > 5) {
      dude = dude.replace('_\u001b[33m´U`\u001b[39m_', '@\u001b[33m´U`\u001b[39m@');
      dude = dude.replace('~', 'O');
    }
    return !this.state.submitted ? dude + '\n' : '';
  },
  limit: 6,
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
