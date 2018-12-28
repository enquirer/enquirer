'use strict';

const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'example',
  message: 'Pick one or more colors',
  choices: [
    { name: 'aqua', value: '#00ffff' },
    { name: 'black', value: '#000000' },
    { name: 'blue', value: '#0000ff' },
    { name: 'fuchsia', value: '#ff00ff' },
    { name: 'green', value: '#008000' },
    { name: 'lime', value: '#00ff00' },
    { name: 'maroon', value: '#800000' },
    { name: 'navy', value: '#000080' }
  ],
  onSubmit() {
    if (this.selected.length === 0) {
      this.enable(this.focused);
    }
  }
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
